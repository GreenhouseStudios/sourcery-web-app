export function useRequestReport(req = null) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)
    const dialogActive = ref(false)

    async function report() {
        console.log('Reporting request...')
        const { data, error } = await supabase.from('reports').insert({
            request_id: request.value.id,
            user_id: user.value.id
        }).select()
        request.value.reports.push(data[0])
        dialogActive.value = false
    }

    return {
        dialogActive,
        report
    }

}