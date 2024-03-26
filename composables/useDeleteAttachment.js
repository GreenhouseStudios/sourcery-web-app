export function useDeleteAttachment() {
    const supabase = useSupabaseClient()

    const deleteLoading = ref(false)
    const deleteError = ref(null)

    async function deleteAttachment(attachment) {
        deleteLoading.value = true

        // We have now added .path for convenience, so we can do that first
        let path = attachment.path ?? ''

        console.log(path)

        if ( !path ) {
            const url = new URL(attachment.url)
            const urlPath = decodeURIComponent(url.pathname)
            const filename = urlPath.replace(/.*\//, '')
            path = 'jobs/' + attachment.request_id + '/' + filename
        }

        try {
            const { data, error } = await supabase
                .storage
                .from('attachments')
                .remove([path])

            if ( error ) {
                console.error('Error deleting attachment', error)
                deleteError.value = error
            }

            const { error: attachmentDeleteError } = await supabase
                .from('attachments')
                .delete()
                .eq('id', attachment.id)

            if ( attachmentDeleteError ) {
                console.error('Error deleting attachment', attachmentDeleteError)
                deleteError.value = attachmentDeleteError
            }
        } catch(e) {
            console.error('Error deleting attachment', e)
            deleteError.value = e
        }

        deleteLoading.value = false

        return
    }

    return {
        deleteLoading,
        deleteError,
        deleteAttachment
    }

}