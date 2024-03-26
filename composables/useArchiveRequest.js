export function useArchiveRequest(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const dialogActive = ref(false)
    const archiveLoading = ref(false)

    async function archiveRequest() {
        archiveLoading.value = true

        // Retrieve the status from the database
        const { data: status, error: statusError } = await supabase.from('status').select().eq('name', 'Archived').single()

        if ( status ) {

            // Update the request status to archived
            const { data, error } = await supabase.from('requests').update({
                status_id: status.id
            }).eq('id', request.value.id).select()

            // Submit an event log for the request archive
            await supabase.rpc('event_status_changed', {
                request_id: request.value.id,
                user_id: user.value.id
            })
            
            request.value.status = status
            dialogActive.value = false
        }
        
        archiveLoading.value = false
    }

    return {
        dialogActive,
        archiveRequest,
        archiveLoading
    }
}