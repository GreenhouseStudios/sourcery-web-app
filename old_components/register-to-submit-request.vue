<template>
  <v-dialog v-model="open" max-width="600">
    <v-form
      ref="register_new_email_form"
      v-model="form_valid"
      lazy-validation
      @submit.prevent="register()"
    >
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <p>{{ bodyText }}</p>
          <v-text-field
            v-model="newUserEmailAddress"
            label="Email Address"
            :rules="[$sourceryForms.rules.required, $sourceryForms.rules.email]"
            required
          />
          <p v-if="submittingRequest">
            Already registered? <a @click="handleAlreadyRegistered">Login Here</a>
          </p>
          <!-- eslint-disable-next-line -->
          <p v-if="showPrivacyTermsWarning">By submitting your email address to Sourcery you agree to our <a target="_blank" href="/terms">Terms &amp; Conditions</a>, and have reviewed our <a target="_blank" href="/privacy">Privacy Policy</a>.</p>
          <!-- skipped -->

          <v-alert
            v-if="submitResultAlert.show"
            :type="submitResultAlert.type"
          >
            {{ submitResultAlert.body }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :color="closeButtonType"
            text
            @click="closeDialog()"
          >
            {{ closeButtonText }}
          </v-btn>
          <v-btn v-if="!hasSubmitted && submitResultAlert.type != `error`" color="primary" text type="submit">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { supabase } from '~/plugins/supabase'

export default {
    props: {
        submittingRequest: {
            type: Boolean,
            default: false
        },
        redirectPath: {
            type: String,
            default: '/'
        }
    },
    data () {
        return {
            open: false,
            newUserEmailAddress: '',
            form_valid: true,
            submitResultAlert: {
                show: false,
                body: 'There has been an error registering.',
                type: 'warning'
            },
            hasSubmitted: false
        }
    },
    computed: {
        ...mapGetters({
            selectedRepository: 'supabaseCreate/repository',
            label: 'supabaseCreate/label',
            citation: 'supabaseCreate/citation',
            clientName: 'supabaseCreate/clientName'
        }),
        bodyText () {
            if (this.submittingRequest) {
                return 'In order to submit a request, you must be registered with Sourcery.  Please log in, or submit your email address to register with us.'
            }
            return 'Log in via magic link by submitting your email address below.'
        },
        showPrivacyTermsWarning () {
            return true
        },
        title () {
            if (this.submittingRequest) {
                return 'Register to Submit Request'
            }
            return 'Log In with Link'
        },
        closeButtonText () {
            return 'Cancel'
        },
        closeButtonType () {
            return ''
        }
    },
    methods: {
        openDialog (email = '') {
            if (email) {
                this.newUserEmailAddress = email
            }
            this.open = true
        },
        closeDialog () {
            this.open = false
        },
        saveRequestToLocalStorage () {
            if (this.submittingRequest) {
                const localStateData = {
                    request: {
                        selectedRepository: this.selectedRepository,
                        label: this.label,
                        citation: this.citation,
                        clientName: this.clientName
                    }
                }

                localStorage.setItem('sourceryInProgressRequest', JSON.stringify(localStateData))
            }
        },
        async register () {
            this.validateRegisterNewEmailForm()
            if (this.form_valid) {
                try {
                    const url = window.location
                    const redirection = `${url.origin}${this.redirectPath}`
                    // const redirection = process.env.BASE_URL === 'http://localhost:3000' ? 'http://localhost:3002/dashboard' : process.env.BASE_URL + '/dashboard'
                    const { error } = await supabase.auth.signInWithOtp({
                        email: this.newUserEmailAddress,
                        options: {
                            emailRedirectTo: redirection
                        }
                    })
                    if (error) {
                        throw error
                    }
                    if (this.submittingRequest) {
                        this.submitResultAlert.body = 'Please check your email for a link to register.'
                    } else {
                        this.submitResultAlert.body = 'Please check your email for a link to login.'
                    }
                    this.submitResultAlert.type = 'success'
                    this.submitResultAlert.show = true

                    this.saveRequestToLocalStorage()

                    this.hasSubmitted = true
                } catch (e) {
                    this.submitResultAlert.body = e.error_description || e.message
                    this.submitResultAlert.type = 'error'
                    this.submitResultAlert.show = true
                }
            }
        },
        validateRegisterNewEmailForm () {
            this.$refs.register_new_email_form.validate()
        },
        handleAlreadyRegistered () {
            this.saveRequestToLocalStorage()
            this.$router.push('/login?redirect=/request/create')
        }
    }
}
</script>
