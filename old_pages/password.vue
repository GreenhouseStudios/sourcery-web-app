<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-alert
        :value="error !== ''"
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
        <span color="white">An email has been sent to the provided address.</span>
      </v-alert>

      <h3>Reset Password</h3>

      <p>Enter your email address and click submit. An email instructing you of how to change your password will be sent shortly.</p><p /><form @submit.prevent="resetPassEmail">
        <v-layout>
          <v-flex>
            <v-text-field
              id="email"
              v-model="email"
              label="Enter Email"
              name="email"
            />
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center>
          <v-btn class="mr-2" @click="$router.go(-1)">
            Back
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
          >
            Submit
          </v-btn>
        </v-layout>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
import { supabase } from '~/plugins/supabase'

export default {
    name: 'Password',
    auth: false,
    data () {
        return {
            email: '',
            success: false,
            error: ''
        }
    },
    methods: {
        async resetPassEmail () {
            this.success = false
            this.error = ''
            try {
                const { data, error } = await supabase.auth.api.resetPasswordForEmail(this.email)
                console.log(data, error)
                if (error) {
                    throw error
                }
                this.success = true
                this.email = ''
            } catch (error) {
                this.error = error.error_description || error.message
            }
        }
    }

}
</script>

<style scoped>

</style>
