<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3>
      <register-to-submit-request
        ref="login_with_link_dialog"
      />

      <v-row v-if="$config.public.BASE_URL === 'http://localhost:3000'">
        <v-col>
          <p>Welcome to Sourcery Local Development!</p>
          <v-btn @click="logInLocalUser('admin')">
            Login as Admin
          </v-btn>
          <v-btn @click="logInLocalUser('test')">
            Login as User
          </v-btn>
        </v-col>
      </v-row>
      <v-form @submit.prevent="handleEmailPassLogin">
        <h1 class="text-center mb-2">
          Log In
        </h1>
        <v-alert
          :value="loginError"
          type="error"
          transition="slide-y-transition"
          text
        >
          {{ messagePass || 'Username or password is incorrect' }}
        </v-alert>
        <v-text-field
          v-model="passEmail"
          type="email"
          name="email"
          label="Email"
          :rules="[$sourceryForms.rules.required, $sourceryForms.rules.email]"
          required
          validate-on-blur
          prepend-icon="mdi-email"
          autofocus
          outlined
        />
        <v-text-field
          v-model="passPass"
          name="password"
          label="Password"
          required
          :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[$sourceryForms.rules.required]"
          prepend-icon="mdi-security"
          validate-on-blur
          outlined
          @click:append="showPass = !showPass"
        />
        <v-btn
          block
          depressed
          x-large
          type="submit"
          color="primary"
          :loading="loadingPass"
          :disabled="loadingPass"
          style="font-weight: 800"
          class="mb-1"
        >
          Log In
        </v-btn>
        <v-btn
          block
          depressed
          x-large
          color="primary"
          style="font-weight: 800"
          class="mb-1"
          @click="loginWithOneTimeLink()"
        >
          Log In With One-Time Link
        </v-btn>
        <v-btn
          block
          text
          large
          to="/password"
        >
          Forgot password?
        </v-btn>

        <v-divider class="my-3" />

        <h2 class="text-center mb-2">
          Don't have an account?
        </h2>
        <v-btn
          block
          outlined
          x-large
          color="primary"
          to="/register"
          style="border-color: #dad4ea; font-weight: 800"
        >
          Register
        </v-btn>

        <p class="mt-2">
          Interested in working with Sourcery as an institution? <nuxt-link to="/join-us">
            Let us know.
          </nuxt-link>
        </p>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import { supabase } from '~/plugins/supabase'
import RegisterToSubmitRequest from '~/components/register-to-submit-request.vue'

export default {
    components: { RegisterToSubmitRequest },
    data () {
        return {
            email: '',
            messagePass: '',
            passPass: '',
            passEmail: '',
            showPass: false,
            loading: false,
            loadingPass: false,
            loginError: false
        }
    },
    methods: {
        ...mapMutations({
            setRedirectHome: 'supabaseAuth/setRedirectHome'
        }),
        async handleEmailPassLogin () {
            this.loadingPass = true
            this.loginError = false
            this.setRedirectHome(true)
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email: this.passEmail,
                    password: this.passPass
                })
                if (error) {
                    this.loginError = true
                    throw error
                }
                this.$toast.success('Logged in Successfully!')
            } catch (e) {
                console.log(e)
                this.loginError = true
                this.messagePass = e.message
            } finally {
                this.loadingPass = false
            }
        },
        loginWithOneTimeLink () {
            this.$refs.login_with_link_dialog.openDialog(this.email)
        },
        logInLocalUser (username) {
            this.setRedirectHome(true)
            supabase.auth.signInWithPassword({
                email: `${username}@sourceryapp.org`,
                password: 'password'
            })
        }
    }
}
</script>
