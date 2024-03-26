export function useArchiveNotes(req) {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const request = ref(req)

    const archiveNotes = ref(req.archive_notes ?? '')
    const archiveCitation = ref(req.archive_citation ?? '')

    const archiveNotesValid = ref(false)
    const archiveNotesLoading = ref(false)

    async function saveNotes(formSubmitEvent = null) {
        archiveNotesLoading.value = true

        if ( formSubmitEvent ) await formSubmitEvent

        if ( archiveNotesValid.value === false ) {
            archiveNotesLoading.value = false
            return
        }

        const { data, error } = await supabase.from('requests').update({
            archive_notes: archiveNotes.value,
            archive_citation: archiveCitation.value
        }).eq('id', request.value.id).select()

        await supabase.rpc('event_request_edited', {
            request_id: request.value.id,
            user_id: user.value.id
        })

        request.value.archive_notes = archiveNotes.value
        request.value.archive_citation = archiveCitation.value
        
        archiveNotesLoading.value = false
    }

    return {
        archiveNotes,
        archiveCitation,
        archiveNotesValid,
        archiveNotesLoading,
        saveNotes
    }
}