import JsZip from 'jszip'
import { Promise } from 'bluebird'
import { saveAs } from 'file-saver'

export function useDownloadAttachments() {

    const { getJsonLdFile } = useJsonLdExport()

    const downloadUrl = ref('')
    const downloadLink = ref(null)
    const downloadLoading = ref(false)

    async function attachmentBlob(url) {
        const image = await fetch(url)
        const imageBlob = await image.blob()
        return imageBlob
    }

    async function attachmentBlobUrl(url) {
        const imageBlob = await attachmentBlob(url)
        const imageUrl = URL.createObjectURL(imageBlob)
        return imageUrl
    }

    async function downloadAttachment(url) {
        downloadLoading.value = true
        const imageUrl = await attachmentBlobUrl(url)
    
        downloadUrl.value = imageUrl
        nextTick(() => {
            downloadLink.value.click()
            downloadLoading.value = false
        })
    }

    async function downloadAttachments(request) {
        downloadLoading.value = true

        const attachmentMeta = await Promise.map(request.attachments, async (attachment) => {
            const imageBlob = await attachmentBlob(attachment.url)
            return {
                imageBlob,
                attachment
            }
        }, {
            concurrency: 5
        })

        const zip = JsZip()
        attachmentMeta.forEach(({ imageBlob, attachment }) => {
            zip.file(attachment.url.substring( attachment.url.lastIndexOf('/') + 1 ).split('?')[0], imageBlob)
        })

        zip.file('tropy-upload-me.jsonld', JSON.stringify(getJsonLdFile(request)))

        const z = await zip.generateAsync({ type: 'blob' })

        const fileName = `request-${request.id}-files.zip`

        const save = await saveAs(z, fileName)

        downloadLoading.value = false

        return save
    }

    return {
        downloadUrl,
        downloadLink,
        downloadLoading,
        attachmentBlob,
        attachmentBlobUrl,
        downloadAttachment,
        downloadAttachments
    }

}