/**
 * Responsible for cancelling a request, and controlling an optional dialog state.
 */
export function useCancelRequest(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const dialogActive = ref(false)
    const cancelLoading = ref(false)

    async function cancelRequest() {
        cancelLoading.value = true

        // Retrieve the status from the database
        const { data: status, error: statusError } = await supabase.from('status').select().eq('name', 'Cancelled').single()

        if ( status ) {

            // Update the request status to cancelled
            const { data, error } = await supabase.from('requests').update({
                status_id: status.id
            }).eq('id', request.value.id).select()

            // Submit an event log for the request cancellation
            await supabase.rpc('event_status_changed', {
                request_id: request.value.id,
                user_id: user.value.id
            })
            
            request.value.status = status
            dialogActive.value = false
        }
        
        cancelLoading.value = false
    }

    return {
        dialogActive,
        cancelRequest,
        cancelLoading
    }
}