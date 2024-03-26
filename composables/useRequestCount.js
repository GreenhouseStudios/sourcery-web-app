/**
 * Primary composable for fetching the # of requests in specific active statuses, for either a user or organization owner.
 */
export function useRequestCount() {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const organization = ref(null)

    const countSubmitted = ref(0)
    const countInProgress = ref(0)
    const countCompleted = ref(0)

    async function fetchRequestCount() {

        // Inner join will guarantee we ONLY return records that match the status
        // Organizations needs to be attached if we are filtering by organization
        const select = `
            *,
            status!inner (name),
            repositories!inner (
                organizations!inner (*)
            )
        `

        // Create 3 different queries because this is not yet an RPC/cannot be chained onto a query
        const submitQuery = supabase.from('requests').select(select, { count: 'exact', head: true }).eq('status.name', 'Submitted')
        const inProgressQuery = supabase.from('requests').select(select, { count: 'exact', head: true }).eq('status.name', 'In Progress')
        const completedQuery = supabase.from('requests').select(select, { count: 'exact', head: true }).eq('status.name', 'Complete')

        // If an organization is selected, we need to filter by that organization
        // Otherwise, filter for the logged in user as the requester.
        if (organization.value) {
            submitQuery.eq('repositories.organizations.id', organization.value.id)
            inProgressQuery.eq('repositories.organizations.id', organization.value.id)
            completedQuery.eq('repositories.organizations.id', organization.value.id)
        } else {
            submitQuery.eq('user_id', user.value.id)
            inProgressQuery.eq('user_id', user.value.id)
            completedQuery.eq('user_id', user.value.id)
        }

        const { count: submittedCount, error: submittedError } = await submitQuery
        const { count: inProgressCount, error: inProgressError } = await inProgressQuery
        const { count: completedCount, error: completedError } = await completedQuery

        if ( !submittedError && !inProgressError && !completedError) {
            countSubmitted.value = submittedCount
            countInProgress.value = inProgressCount
            countCompleted.value = completedCount
        }
    }

    return {
        countSubmitted,
        countInProgress,
        countCompleted,
        organization,
        fetchRequestCount
    }
    
}