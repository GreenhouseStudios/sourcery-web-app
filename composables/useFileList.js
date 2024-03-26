import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'

export function useFileList(req) {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const fileList = ref()
    const files = ref([])
    const config = useRuntimeConfig()
    const request = ref(req)

    const thumbnails = {
        'image/tiff': '/img/tiff.svg',
        'application/pdf': '/img/pdf.svg'
    }

    function add(file) {
        const fileReference = {
            key: uuidv4(),
            value: file,
            active: true,
            thumbnail: getImagePreview(file),
            status: 'Uploading...',
            clearable: false
        }

        if ( file.size > config.public.maxUploadBytes ) {
            fileReference.status = 'File too large. Max size is 50MB.'
            fileReference.clearable = true
        }
        /**
         * Made a custom object here bc Vue 2 doesn't support
         * Map() reactivity. Nor will it.
         * @link https://github.com/vuejs/vue/issues/6644#issuecomment-434806014
         */
        files.value.push(fileReference)

        if ( !fileReference.clearable ) {
            uploadImage(fileReference)
        }
    }

    function addAll(fileList) {
        for (const f of fileList) {
            add(f)
        }
    }

    /**
     * Won't actually remove the element bc that
     * will eff up our indexes on the array.
     */
    function remove(key) {
        files.value.forEach((item, index) => {
            if (item.key === key) {
                item.active = false
            }
        })
    }

    function reset() {
        files.value = []
        fileList.value = null
        request.value = null
    }

    function getImagePreview(file) {
        return thumbnails[file.type] ?? URL.createObjectURL(file)
    }

    function getAttachmentPreview(attachment) {
        return thumbnails[attachment.mime] ?? attachment.url
    }

    async function uploadImage(fileReference) {
        if ( !request.value ) {
            console.error('No request has been set in the useFileList composable.  Cannot upload.')
            fileReference.status = 'Error: Attempt to upload to a non-existant request.'
            fileReference.clearable = true
            return
        }

        const fileName = fileReference.key + '.' + mime.extension(fileReference.value.type)
        const filePath = 'jobs/' + request.value.id + '/' + fileName

        try {
            const { data, error } = await supabase.storage
                .from('attachments')
                .upload(filePath, fileReference.value, {
                    cacheControl: '3600'
                })

            if ( error ) {
                console.error(error)
                fileReference.status = 'Error: ' + error
                fileReference.clearable = true
                return
            }

            const { data: signedUrlData, error: signedUrlError } = await supabase
                .storage
                .from('attachments')
                .createSignedUrl(filePath, 86400) // Signed for one day.

            fileReference.status = 'Uploaded'
            fileReference.clearable = true

            const { data: attachment, error: attachmentError } = await supabase.from('attachments').insert({
                request_id: request.value.id,
                user_id: user.value.id,
                url: signedUrlData.signedUrl,
                mime: fileReference.value.type,
                pages: 1,
                label: fileReference.value.name,
                size: fileReference.value.size,
                path: filePath
            }).select().single()

            if ( attachmentError ) {
                console.error(attachmentError)
                fileReference.status = 'Error: ' + attachmentError
                fileReference.clearable = true
                console.log(fileReference)
                return
            }

            attachment.thumbnail = getAttachmentPreview(attachment)

            request.value.attachments.push(attachment)

            remove(fileReference.key)
        } catch (error) {
            console.log(error)
            fileReference.status = 'Error: ' + error
            fileReference.clearable = true
        }
    }

    watch(fileList, (newVal, oldVal) => {
        if (newVal) {
            addAll(newVal)
            fileList.value = null
        }
    })

    return {
        fileList,
        files,
        add,
        addAll,
        remove,
        reset,
        getAttachmentPreview
    }
}