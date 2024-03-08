export function useFetchRequest() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const route = useRoute()

    const request = ref(null)
    const requestId = ref(route.params.id ?? null)

    // This function defaults to the request ID parameter in the route, but can be called with a different ID.
    async function fetchRequest() {
        const { data, error } = await supabase.from('requests').select(`
            *,
            status (*),
            repository:repositories (
                *,
                organization:organizations (*)
            ),
            request_clients(*),
            request_vendors(*),
            user (*),
            request_events (
                *,
                status (id, name)
            )
        `).order('created_at', { ascending: false })
            .eq('id', requestId.value)
            .single()

        if ( !error ) {
            request.value = data
        }
    }

    const isSubmitted = computed(() => {
        return request.value.status.name === 'Submitted' ?? false
    })

    const isCancelled = computed(() => {
        return request.value.status.name === 'Cancelled' ?? false
    })

    const isInProgress = computed(() => {
        return request.value.status.name === 'In Progress' ?? false
    })

    const isCompleted = computed(() => {
        return request.value.status.name === 'Complete' ?? false
    })

    const isArchived = computed(() => {
        return request.value.status.name === 'Archived' ?? false
    })

    const confirmedDate = computed(() => {
        return request.value.request_events.find(event => event.status.name === 'In Progress')?.created_at ?? null 
    })

    const completedDate = computed(() => {
        return request.value.request_events.find(event => event.status.name === 'Complete')?.created_at ?? null 
    })

    const archivedDate = computed(() => {
        return request.value.request_events.find(event => event.status.name === 'Archived')?.created_at ?? null 
    })

    const cancelledDate = computed(() => { 
        return request.value.request_events.find(event => event.status.name === 'Cancelled')?.created_at ?? null 
    })

    return {
        request,
        requestId,
        fetchRequest,
        isSubmitted,
        isInProgress,
        isCompleted,
        isArchived,
        isCancelled,
        confirmedDate,
        completedDate,
        archivedDate,
        cancelledDate
    }
}