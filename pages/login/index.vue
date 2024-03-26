<template>
    <div id="page-login">
        <v-container class="mt-10 text-center">
            <v-row justify="center" align="center">
                <v-col md="6">
                    <ToolsLocalLogin />
                    
                    <v-form @submit.prevent="submitEmailOtpLogin" validate-on="submit">
                        <h1 class="mb-4">Log In</h1>

                        <p class="mb-6">Receive a one-time code to your account email to log into Sourcery.</p>

                        <v-text-field v-model="formEmail" type="email" label="Email" prepend-icon="mdi-email" autofocus variant="outlined"></v-text-field>

                        <v-btn block size="x-large" color="primary" class="font-weight-bold mb-4" type="submit" :loading="formLoading">Get Code</v-btn>

                        <v-btn block size="large" variant="text">Forgot Password?</v-btn>
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

const formLoading = ref(false)
const formEmail = ref('')
async function submitEmailOtpLogin() {
    formLoading.value = true
    const { data, error } = await supabase.auth.signInWithOtp({
        email: formEmail.value,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.protocol}://${window.location.host}/dashboard`
        }
    })
    formLoading.value = false
    navigateTo({
        path: '/login/otp',
        query: {
            email: formEmail.value
        }
    })
}
</script>