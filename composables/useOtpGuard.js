export default function useOtpGuard() {
    const supabase = useSupabaseClient()
    const step = ref(1)

    const sendVerificationError = ref(null)
    const sendVerificationLoading = ref(false)

    const otpCode = ref('')
    const verifyOtpError = ref(null)
    const verifyOtpLoading = ref(false)


    async function sendVerification() {
        sendVerificationLoading.value = true
        sendVerificationError.value = null

        const { error } = await supabase.auth.reauthenticate()

        if (error) {
            sendVerificationError.value = error
            sendVerificationLoading.value = false
            return
        }

        sendVerificationLoading.value = false
        step.value = 2
    }

    async function verifyOtp() {
        verifyOtpLoading.value = true
        verifyOtpError.value = null
        verifyOtpLoading.value = false
        step.value = 3
    }

    function clear() {
        step.value = 1
        sendVerificationError.value = null
        sendVerificationLoading.value = false
        otpCode.value = ''
        verifyOtpError.value = null
        verifyOtpLoading.value = false
    }

    return {
        step,
        sendVerificationError,
        sendVerificationLoading,
        sendVerification,
        otpCode,
        verifyOtpError,
        verifyOtpLoading,
        verifyOtp,
        clear
    }
}