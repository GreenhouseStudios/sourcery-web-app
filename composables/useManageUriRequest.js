export function useManageUriRequest(req = null) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const route = useRoute()

    const request = ref(req)
    const uriId = ref(req?.id ?? route.params.id ?? null)
    const repository = ref(null)

    async function fetchUriRequest() {
        const { data, error } = await supabase.from('requests_prospective').select(`
            *,
            user (*)
        `).eq('id', uriId.value).single()

        if ( error ) {
            console.error(error)
        } else {
            request.value = data
        }
    }

    async function convert() {
        console.log({ request: request.value, repository: repository.value })
        if ( request.value && repository.value ) {
            const { data, error } = await supabase.rpc('convert_request', {
                prospective_request_id: request.value.id,
                repository_id: repository.value.id
            }).single()

            if ( error ) {
                console.error(error)
            } else {
                request.value = data
                navigateTo('/request/' + request.value.id)
                return true
            }
        }
        return false
    }

    async function deleteRequest() {
        if ( request.value ) {
            const { data, error } = await supabase.from('requests_prospective')
                .update({ deleted: true })
                .eq('id', request.value.id)
                .select()

            if ( error ) {
                console.error(error)
            } else {
                request.value.deleted = true
                return true
            }
        }
        return false
    }

    return {
        uriId,
        request,
        repository,
        fetchUriRequest,
        convert,
        deleteRequest
    }

}