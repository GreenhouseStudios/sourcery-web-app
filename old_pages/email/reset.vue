<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm-3>
      <h3 class="mb-4">
        {{ pageTitle }}
      </h3>

      <p class="mb-4">
        {{ pageText }}
      </p>

      <p v-if="email" class="mb-4">
        Email: {{ email }}
      </p>

      <v-alert
        :value="error !== ''"
        class="my-3"
        type="error"
      >
        {{ error }}
      </v-alert>

      <v-btn v-if="error === '' && showAction" color="primary" :href="redirectLink">
        {{ buttonText }}
      </v-btn>
      <v-btn v-if="error" color="primary" to="/login">
        Login
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    data () {
        return {
            redirectLink: '',
            type: 'magic',
            error: '',
            email: '',
            showAction: false
        }
    },
    computed: {
        typeMatch () {
            const allowed = ['magic', 'magiclink', 'recovery', 'signup', 'invite']
            if (allowed.includes(this.type)) {
                return this.type
            }
            return null
        },
        pageTitle () {
            switch (this.typeMatch) {
            case 'magic':
                return 'Continue to Log Into Sourcery'
            case 'magiclink':
                return 'Continue to Log Into Sourcery'
            case 'recovery':
                return 'Reset Password'
            case 'signup':
                return 'Confirm Signup'
            case 'invite':
                return 'You have been invited to Sourcery!'
            default:
                return 'Continue Sourcery Action'
            }
        },
        buttonText () {
            switch (this.typeMatch) {
            case 'magic':
                return 'Log In'
            case 'magiclink':
                return 'Log In'
            case 'recovery':
                return 'Reset Password'
            case 'signup':
                return 'Confirm Signup'
            case 'invite':
                return 'Confirm Invite'
            default:
                return 'Continue'
            }
        },
        pageText () {
            switch (this.typeMatch) {
            case 'magic':
                return 'Proceed to log into Sourcery using the button below.'
            case 'magiclink':
                return 'Proceed to log into Sourcery using the button below.'
            case 'recovery':
                return 'Continue to reset your password using the button below.'
            case 'signup':
                return 'Confirm your new Sourcery account using the button below. Make sure to visit the settings page to set a password if you haven\'t already.'
            case 'invite':
                return 'You have been invited to join the Sourcery community.  Use the button below to confirm a sign up email and proceed to the application.  Make sure to visit the settings page to set a password!'
            default:
                return 'Continue to Sourcery below.'
            }
        }
    },
    mounted () {
        const params = (new URL(location)).searchParams
        this.redirectLink = params.get('confirmation')

        if (!this.redirectLink) {
            this.error = 'Insufficient params for this page.'
            return false
        }

        if (params.get('email')) {
            this.email = params.get('email')
        }

        if (!this.redirectLink.includes(process.env.SUPABASE_URL)) {
            this.error = 'Email was created from a different domain than this one.  Please confirm you clicked the correct link.'
        }
        const confirmationLink = new URL(params.get('confirmation'))
        const confirmationLinkParams = confirmationLink.searchParams
        this.type = confirmationLinkParams.get('type')
        if (this.type !== 'recovery') {
            confirmationLink.searchParams.set('redirect_to', confirmationLinkParams.get('redirect_to') + '/login/redirect')
            // confirmationLink.searchParams.set('redirect_to', 'http://localhost:3000/login/redirect')
            const newLink = confirmationLink.toString()
            this.redirectLink = newLink
        }
        this.showAction = true
    }
}
</script>
