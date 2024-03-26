export function useCompleteRequest(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const dialogActive = ref(false)
    const completeLoading = ref(false)

    async function completeRequest() {
        completeLoading.value = true

        // Retrieve the status from the database
        const { data: status, error: statusError } = await supabase.from('status').select().eq('name', 'Complete').single()

        if ( status ) {

            // Update the request status to completed
            const { data, error } = await supabase.from('requests').update({
                status_id: status.id
            }).eq('id', request.value.id).select()

            // Submit an event log for the request completion
            await supabase.rpc('event_status_changed', {
                request_id: request.value.id,
                user_id: user.value.id
            })
            
            request.value.status = status
            dialogActive.value = false
        }
        
        completeLoading.value = false
    }

    return {
        dialogActive,
        completeRequest,
        completeLoading
    }

}