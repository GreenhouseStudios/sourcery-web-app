export function useRequestMessenger(req = null) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { canService } = useFetchRequest(req)

    const request = ref(req)
    const messages = ref([])
    const reports = ref([])

    // Fields for the message form
    const message = ref('')
    const messageFormValid = ref(false)
    const messageFormLoading = ref(false)
    const messageFormError = ref()

    function sendMessage() {
        console.log('Sending message...')
    }

    async function getMessages() {
        const { data, error } = await supabase.from('request_comments')
            .select('*')
            .eq('request_id', request.value.id)
            .order('created_at', { ascending: true })

        if ( !error ) {
            messages.value = data

            await getReports()
        }
    }

    async function getReports() {
        const { data, error } = await supabase.from('reports')
            .select('*')
            .eq('request_id', request.value.id)
            .order('created_at', { ascending: true })

        if ( !error ) {
            reports.value = data
        }
    }

    async function clearUnread() {
        if ( canService.value ) {
            request.value.request_vendors.has_unread = false
            await supabase.from('request_vendors')
                .update({ has_unread: false })
                .eq('request_id', request.value.id)
        } else {
            request.value.request_clients.has_unread = false
            await supabase.from('request_clients')
                .update({ has_unread: false })
                .eq('request_id', request.value.id)
        }
    }

    async function sendMessage(formSubmitEvent) {
        messageFormLoading.value = true
        if ( message.value.trim() === '' ) {
            return false
        }

        // Need to wait for form validation to resolve
        if ( formSubmitEvent ) await formSubmitEvent
        if ( !messageFormValid.value ) {
            messageFormLoading.value = false
            return false
        }

        const newMessage = {
            request_id: request.value.id,
            content: message.value,
            user_id: user.value.id,
            created_at: new Date().toISOString(),
            vendor: canService.value
        }

        const { data, error } = await supabase.from('request_comments').insert(newMessage).select()
        console.log(data, error)

        messageFormLoading.value = false
        if ( !error ) {
            messages.value.push(data[0])
            message.value = ''

            const { data: insert_id, error } = await supabase.rpc('sent_chat', {
                request_id: request.value.id,
                user_id: user.value.id
            })

            return true
        }
        messageFormError.value = error
        return false
    }

    const hasUnread = computed(() => {
        if ( canService.value ) {
            return request.value?.request_vendors?.has_unread ?? false
        }
        return request.value?.request_clients?.has_unread ?? false
    })

    const isReported = computed(() => {
        return reports.value.length > 0
    })

    return {
        request,
        reports,
        messages,
        getMessages,
        sendMessage,
        hasUnread,
        clearUnread,
        isReported,
        messageFormValid,
        messageFormLoading,
        messageFormError,
        message
    }

}