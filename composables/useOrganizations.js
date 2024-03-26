export default function useOrganizations() {
    const supabase = useSupabaseClient()

    const organizations = ref([])
    async function getOrganizations() {
        const { data, error } = await supabase.from('organizations').select(`*`)
            .order('name')
            .range(0, 100)

        if ( !error ) {
            organizations.value = data
        }
    }


    const organization = ref()
    async function getOrganization(id) {
        const { data, error } = await supabase.from('organizations').select('*')
            .eq('id', id)
            .single()

        if ( !error ) {
            organization.value = data
        }
    }

    return {
        organizations,
        organization,
        getOrganizations,
        getOrganization
    }
}