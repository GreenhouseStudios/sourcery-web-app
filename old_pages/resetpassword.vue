<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-alert
        :value="error"
        class="my-3"
        type="error"
      >
        <span color="white">{{ error }}</span>
      </v-alert>
      <v-alert
        :value="success"
        class="my-3"
        type="success"
      >
        <span color="white">Password has been successfully reset.</span>
      </v-alert>

      <h1>Reset Pass</h1>
      <form @submit.prevent="resetPass">
        <v-layout>
          <v-flex>
            <v-text-field
              id="password"
              v-model="password"
              label="Enter Password"
              name="password"
            />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-text-field
              id="confirmpassword"
              v-model="confirmpassword"
              label="Confirm Password"
              name="confirmpassword"
            />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-btn :to="{name: 'login'}" class="mr-2">
              Return
            </v-btn>
            <v-btn
              :disabled="!passwordIsValid"
              type="submit"
              color="primary"
            >
              Submit
            </v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { supabase } from '~/plugins/supabase'

export default {
    name: 'Resetpass',
    auth: false,
    data () {
        return {
            password: '',
            confirmpassword: '',
            mismatch_password: false,
            error: false,
            success: false
        }
    },
    computed: {
        ...mapGetters({
            resetAccessToken: 'supabaseAuth/resetAccessToken'
        }),
        passwordIsValid () {
            if (this.password !== this.confirmpassword || this.password === '') {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        async resetPass () {
            this.error = false
            this.success = false
            const { error } = await supabase.auth.api.updateUser(this.resetAccessToken, { password: this.password })

            if (error) {
                this.error = error.error_description || error.message
                console.log(error)
                return
            }

            this.success = true
            this.$router.push('/dashboard')
        }
    }
}
</script>
