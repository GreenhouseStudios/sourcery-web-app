<template>
    <div id="page-login-otp">
        <v-container class="mt-10 text-center">
            <v-row justify="center" align="center">
                <v-col md="6">
                    <p>An email was sent to {{ route.query.email }} with a one-time code.  Please enter that code here to be authenticated.</p>

                    <v-alert color="error" title="Verification Error" :text="formError" v-if="formError"></v-alert>

                    <v-form @submit.prevent="confirmOtpCode" validate-on="submit">
                        <v-otp-input v-model="formCode" autofocus></v-otp-input>
                        <v-btn block size="x-large" color="primary" class="font-weight-bold mb-1" type="submit" :loading="formLoading">Verify &amp; Login</v-btn>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['guest']
})

const supabase = useSupabaseClient()
const route = useRoute()

if ( !route.query.email ) {
    navigateTo('/login')
}

const formLoading = ref(false)
const formCode = ref('')
const formError = ref('')

async function confirmOtpCode() {
    formLoading.value = true
    const { data, error } = await supabase.auth.verifyOtp({
        email: route.query.email,
        token: formCode.value,
        type: 'email'
    })

    if ( error ) {
        formError.value = error.message
        formLoading.value = false
        return
    }

    formLoading.value = false
    navigateTo('/dashboard')
}
</script>