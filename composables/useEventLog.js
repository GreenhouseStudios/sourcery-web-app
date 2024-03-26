export function useEventLog(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const newLogDialog = ref(false)

    const newLogMessage = ref('')
    const newLogMessageValid = ref(false)
    const newLogMessageLoading = ref(false)
    const newLogMessageError = ref()

    async function addMessage(formSubmitEvent = null) {
        newLogMessageLoading.value = true

        if ( formSubmitEvent ) await formSubmitEvent

        if ( newLogMessageValid.value === false ) {
            newLogMessageLoading.value = false
            return
        }

        const { data, error } = await supabase.from('request_events').insert({
            request_id: request.value.id,
            status_id: request.value.status.id,
            user_id: user.value.id,
            description: newLogMessage.value,
            auto: false
        }).select(`
            *,
            user (*),
            status (name)
        `)

        if ( error ) {
            newLogMessageError.value = error
        } else {
            newLogMessage.value = ''
            newLogDialog.value = false
            request.value.request_events.push(data[0])
        }
        newLogMessageLoading.value = false
    }

    function getEventDescription(event) {
        return event.description.replace('%u', event.user.name ?? 'User').replace('%s', event.status.name)
    }

    return {
        newLogDialog,
        newLogMessage,
        newLogMessageValid,
        newLogMessageLoading,
        newLogMessageError,
        addMessage,
        getEventDescription
    }

}