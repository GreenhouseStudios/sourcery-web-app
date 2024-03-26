export function useFetchStatus() {
    const supabase = useSupabaseClient()

    const statuses = ref([])

    async function fetchStatus() {
        const { data, error } = await supabase.from('status').select('*')

        if ( !error ) {
            statuses.value = data
        }
    }

    function findByName(name) {
        return statuses.value.find(status => status.name === name)
    }

    function linkToRequestsByStatusName(name) {
        const url = '/requests'
        const status = findByName(name)
        if ( status ) {
            return `${url}?status=${status.id}`
        }
        return url
    }

    return {
        statuses,
        fetchStatus,
        findByName,
        linkToRequestsByStatusName
    }

}