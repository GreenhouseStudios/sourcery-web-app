/**
 * Allows the use of useAuthUser() in nuxt files, accessing the metadata of the current logged in user.
 * Returns a reactive ref of the user's metadata.
 * 
 * This is intended to be accessed in a synchronous context, and use a global store to cache the user's metadata.
 * It also watches the current supabase state and reacts accordingly to fetch new or clear data.
 */
export function useAuthUser() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    // Establish the global state that will be reused across all instances of this composable.
    const authUser = useState('authUser')

    // Fetches the current user metadata and their organization access.
    async function fetchUserMetadata() {
        if (!user.value) {
            return null
        }

        const { data, error } = await supabase.from('user').select(`
        *,
        organizations!organizations_owner_id_fkey (
            *,
            repositories (*)
        )
        `).eq('id', user.value.id).single()

        if (error) {
            console.error('Error fetching user', error)
            return user.value = null
        }
        
        authUser.value = data
    }

    // Responsible for clearing the global authUser state, and any other cleanup when supabase state changes.
    function clear() {
        clearNuxtState('authUser')
    }

    function clearAndRefetch() {
        clear()
        fetchUserMetadata()
    }

    const userOrgs = computed(() => {
        return authUser.value?.organizations ?? []
    })

    const userRepos = computed(() => {
        return authUser.value?.organizations?.flatMap(org => org.repositories) ?? []
    })

    const isOrgOwner = computed(() => {
        return userOrgs.value.length > 0
    })

    return {
        authUser,
        userOrgs,
        userRepos,
        isOrgOwner,
        fetchUserMetadata,
        clearAndRefetch
    }
}