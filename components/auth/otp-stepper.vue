<template>
    <v-stepper v-model="step" :items="['Send', 'Verify', props.title]" hide-actions>
        <template v-slot:item.1>
            <v-card title="Send Verification">
                <v-card-text>
                    <p>Would you like to send a verification code to your email address {{ authUser?.email }}?</p>
                    <v-alert color="error" title="Verification Error" :text="sendVerificationError" v-if="sendVerificationError" class="mb-5"></v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="cancel">Cancel</v-btn>
                    <v-btn color="primary" variant="text" @click="sendVerification" :loading="sendVerificationLoading">Send</v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <template v-slot:item.2>
            <v-card title="Confirm Login Session">
                <v-card-text>
                    <v-form @submit.prevent="verifyOtp">
                        <v-alert color="error" title="Verification Error" :text="verifyOtpError" v-if="verifyOtpError" class="mb-5"></v-alert>
                        <p>An email was sent to {{ authUser?.email }} with a one-time code.  Please enter that code here to be authenticated.</p>
                        <v-otp-input v-model="otpCode" autofocus></v-otp-input>
                        <v-btn block size="x-large" color="primary" class="font-weight-bold mb-1" type="submit" :loading="verifyOtpLoading">Verify</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </template>
        <template v-slot:item.3>
            <slot />
        </template>
    </v-stepper>
</template>

<script setup>
const props = defineProps(['title'])
const emit = defineEmits(['cancelled', 'clear'])
const { authUser } = useAuthUser()

const {
    step,
    sendVerificationError,
    sendVerificationLoading,
    sendVerification,
    otpCode,
    verifyOtpError,
    verifyOtpLoading,
    verifyOtp,
    clear 
} = useOtpGuard()

defineExpose({
    clear,
    otpCode
})

function cancel() {
    clear()
    emit('cancelled')
}
</script>