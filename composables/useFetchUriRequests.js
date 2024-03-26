export function useFetchUriRequests() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const requests = ref([])
    const requestCount = ref(0)
    const page = ref(1)
    const limit = ref(30)

    async function fetchUserUriRequests() {
        const { data, error } = await supabase.from('requests_prospective')
            .select(`*`)
            .order('created_at', { ascending: false })
            .eq('user_id', user.value.id)
            .eq('converted', false)
            .eq('deleted', false)
            .range((page.value - 1) * 30, limit.value)

        if ( !error ) {
            requests.value = data
        }

        return
    }

    async function fetchAllUriRequests() {
        const { data, error } = await supabase.from('requests_prospective')
            .select(`
                *,
                user (*)
            `)
            .order('created_at', { ascending: false })
            .eq('converted', false)
            .eq('deleted', false)
            .range((page.value - 1) * 30, limit.value)

        if ( !error ) {
            requests.value = data
        }

        return
    }


    async function countUriRequests() {
        const { count, error } = await supabase.from('requests_prospective')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.value.id)
            .eq('deleted', false)
            .eq('converted', false)

        if ( !error ) {
            requestCount.value = count
        }

        return
    }

    return {
        requests,
        page,
        limit,
        requestCount,
        fetchUserUriRequests,
        fetchAllUriRequests,
        countUriRequests
    }
}