<template>
    <div>
        <v-dialog width="600" v-model="dialog">
            <template v-slot:activator="{ props }">
                <v-btn variant="text" v-bind="props" text="Change"></v-btn>
            </template>

            <template v-slot:default>
                <AuthOtpStepper title="Change" @cancelled="clear" ref="otpAuthGuard">
                    <v-card title="Change Password">
                        <v-form @submit.prevent="submitChange">
                            <v-card-text>
                                <v-alert color="error" title="Save New Password Error" :text="savePasswordError" v-if="savePasswordError" class="mb-5"></v-alert>
                                <v-text-field label="New Password" variant="outlined" v-model="password" type="password"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="clear">Cancel</v-btn>
                                <v-btn type="submit" color="primary" variant="text" :loading="savePasswordLoading">Save</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </AuthOtpStepper>
            </template>
        </v-dialog>
        <v-snackbar v-model="showSuccess" color="success" timeout="5000" top>
            Password Changed Successfully
        </v-snackbar>
    </div>
    
</template>

<script setup>
const { authUser } = useAuthUser()
const { updateProfile } = useUpdateProfile()
const supabase = useSupabaseClient()

const dialog = ref(false)
const otpAuthGuard = ref()

const password = ref('')
const savePasswordError = ref(null)
const savePasswordLoading = ref(false)

const showSuccess = ref(false)

async function submitChange(output) {
    savePasswordLoading.value = true
    const { user, error } = await supabase.auth.updateUser({password: password.value, nonce: otpAuthGuard.value.$.exposed.otpCode.value})
    if ( error ) {
        console.error('error', error)
        savePasswordError.value = error.message
        return
    }
    showSuccess.value = true
    clear()
}

function clear() {
    otpAuthGuard.value.$.exposed.clear()
    password.value = ''
    savePasswordError.value = null
    savePasswordLoading.value = false
    dialog.value = false
}
</script>