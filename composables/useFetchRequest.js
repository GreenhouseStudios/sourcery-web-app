export function useFetchRequest(req = null) {
    const supabase = useSupabaseClient()
    const route = useRoute()
    const { getAttachmentPreview } = useFileList()
    const { userRepos } = useAuthUser()

    const request = ref(req)
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
                status (id, name),
                user (*)
            ),
            attachments (*),
            reports (*)
        `).order('created_at', { ascending: false })
            .eq('id', requestId.value)
            .single()

        if ( !error ) {

            /**
             * Attachments are protected, so we need to retrieve signed URLs for them.
             */
            const attachment_paths = data.attachments.map(attachment => attachment.path)
            if ( attachment_paths.length > 0 ) {
                const { data: signedUrlData, error: signedUrlError } = await supabase
                    .storage
                    .from('attachments')
                    .createSignedUrls(attachment_paths, 86400) // Signed for one day.
                signedUrlData.forEach((signedUrl, index) => {
                    if ( !signedUrl.error ) {
                        data.attachments[index].url = signedUrl.signedUrl
                    }
                    data.attachments[index].thumbnail = getAttachmentPreview(data.attachments[index])
                })
            }

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

    const requestLabel = computed(() => {
        return request.value.request_vendors?.label ?? request.value.request_clients?.value ?? request.value.original_title ?? 'Untitled'
    })

    const canService = computed(() => {
        return userRepos?.value.some(repo => repo.id === request.value.repository.id) ?? false
    })

    const isReported = computed(() => {
        return request.value.reports.length > 0
    })


    return {
        request,
        requestId,
        requestLabel,
        fetchRequest,
        isSubmitted,
        isInProgress,
        isCompleted,
        isArchived,
        isCancelled,
        isReported,
        confirmedDate,
        completedDate,
        archivedDate,
        cancelledDate,
        canService
    }
}