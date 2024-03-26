export default function useFetchRepositories() {
    const supabase = useSupabaseClient()

    const repositories = ref([])
    const fetchRepositoriesError = ref()

    async function fetchRepositories() {
        const { data, error } = await supabase.from('repositories').select(`
            *,
            organization:organizations (*),
            featured_image:featured_images (*)
        `)
        .order('name')
        .eq('active', true)

        if ( error ) {
            fetchRepositoriesError.value = error
            return
        }

        repositories.value = data
    }

    return {
        repositories,
        fetchRepositories
    }
}