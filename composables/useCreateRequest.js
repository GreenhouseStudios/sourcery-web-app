export default function useCreateRequest() {
    const supabase = useSupabaseClient()
    const { authUser } = useAuthUser()

    const requestFormValid = ref(false)
    const requestFormLoading = ref(false)
    const requestFormError = ref()
    const requestCreatedSubmitDialog = ref(false)
    const requestFields = ref({
        user: {
            name: '',
            email: ''
        },
        title: '',
        details: '',
        repository: {}
    })
    const createdRequest = ref()

    async function requestFormPopulateCurrentUser() {
        requestFields.value.user.name = authUser.value.name
        requestFields.value.user.email = authUser.value.email
    }

    async function createRequest(formSubmitEvent) {
        requestFormLoading.value = true

        // This is a weird one, vuetify3 form events are async and the validation is not done until the promise resolves.
        // So, we have to await the event for requestFormValid.value to be true.
        // Can also access the formSubmitEvent.valid property from this awaited prop.
        if ( formSubmitEvent ) await formSubmitEvent

        if ( requestFormValid.value ) {
            requestCreatedSubmitDialog.value = true
            const { data, error } = await supabase.from('requests').insert({
                repository_id: requestFields.value.repository.id,
                citation: requestFields.value.details,
                status_id: 1,
                user_id: authUser.value.id,
                original_title: requestFields.value.title
            }).select().single()

            if ( error ) {
                requestFormError.value = error
            } else {
                createdRequest.value = data
            }
        }

        requestFormLoading.value = false
        console.log(createdRequest.value)
        return null
    }

    return {
        requestFields,
        requestFormValid,
        requestFormLoading,
        requestFormError,
        createdRequest,
        requestCreatedSubmitDialog,
        requestFormPopulateCurrentUser,
        createRequest
    }

}