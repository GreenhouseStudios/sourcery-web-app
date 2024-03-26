<template>
  <v-layout fill-height align-center>
    <v-flex xs12 sm6 offset-sm3 lg4 offset-lg4>
      <v-form @submit.prevent="registerValid">
        <h1 class="text-center">
          Register
        </h1>
        <v-alert
          v-if="message"
          :value="true"
          text
          type="error"
          class="mt-2 mb-2"
        >
          {{ message }}
        </v-alert>
        <v-alert
          v-if="successMessage"
          :value="true"
          text
          type="success"
          class="mt-2 mb-2"
        >
          {{ successMessage }}
        </v-alert>
        <v-alert
          :value="errorEmpty"
          type="error"
          text
        >
          <span color="white">All fields are required.</span>
        </v-alert>
        <v-text-field
          v-model="name"
          type="text"
          name="name"
          :rules="[$sourceryForms.rules.required]"
          label="Full Name"
          required
          clearable
          autofocus="autofocus"
          validate-on-blur
          prepend-icon="mdi-account-circle"
          outlined
          autocomplete="off"
        />
        <span v-for="(err, index) in errors.name" class="red--text">{{ err }}</span>
        <v-text-field
          v-model="email"
          type="email"
          name="email"
          label="Email"
          :rules="[$sourceryForms.rules.email]"
          required
          clearable
          validate-on-blur
          prepend-icon="mdi-email"
          outlined
          autocomplete="off"
        />
        <span v-for="(err, index) in errors.email" class="red--text">{{ err }}</span>
        <v-layout>
          <v-text-field
            v-model="password"
            name="password"
            label="Password"
            autocomplete="new-password"
            messages="At least 8 characters and 1 special character."
            :rules="$sourceryForms.rules.password"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            required
            counter
            error-count="2"
            :success="password==confirm_password && password !=''"
            validate-on-blur
            loading
            prepend-icon="mdi-security"
            outlined
            @click:append="showPass = !showPass"
          >
            <template #progress>
              <v-progress-linear
                :value="progress"
                :color="color"
                height="2"
                absolute
              />
            </template>
          </v-text-field>
        </v-layout>
        <v-alert
          :value="errorLength"
          type="warning"
          text
        >
          <span color="white">Password length must be at least 8 characters.</span>
        </v-alert>
        <v-alert
          :value="errorSpecial"
          type="warning"
          text
        >
          <span color="white">Password must include a special character.</span>
        </v-alert>
        <v-text-field
          v-model="phone"
          type="phone"
          name="phone"
          label="Phone Number"
          :rules="[$sourceryForms.rules.required]"
          required
          validate-on-blur
          prepend-icon="mdi-phone"
          outlined
        />
        <div class="hidden-xs-only">
          <v-btn
            block
            x-large
            depressed
            type="submit"
            value="Register"
            color="primary"
            :loading="loading"
            :disabled="!!successMessage"
            class="mb-4"
          >
            Next
          </v-btn>
          <v-btn
            block
            x-large
            color="primary"
            outlined
            to="/login"
          >
            Cancel
          </v-btn>
        </div>
        <v-card min-width="100%" class="bottom-buttons hidden-sm-and-up">
          <v-btn
            block
            x-large
            depressed
            type="submit"
            value="Register"
            color="primary"
            :loading="loading"
            class="mb-2"
          >
            Next
          </v-btn>
          <v-btn
            block
            x-large
            color="primary"
            outlined
            to="/login"
            style="border-color: #dad4ea"
          >
            Cancel
          </v-btn>
        </v-card>
        <v-spacer style="height: 122px;" />
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { supabase } from '~/plugins/supabase'
import { notify } from '~/plugins/sourcery-functions'

export default {
    name: 'Register',
    /**
   * Don't require auth for this page.
   */
    auth: false,
    data () {
        return {
            name: '',
            email: '',
            password: '',
            showPass: false,
            special_characters: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '_', '-', '+', '=', '`', '|', '(', ')', '{', '}', '[', ']', ':', ';', "'", '<', '>', ',', '.', '?', '/'],
            goodPass: [
                'At least 8 characters',
                'At least 1 special character'
            ],
            confirm_password: '',
            phone: '',
            message: null,
            successMessage: null,
            execute: true,

            loading: false,
            errorEmpty: false,
            errorMatch: false,
            errorLength: false,
            errorSpecial: false,

            errors: {
                name: [],
                email: [],
                password: [],
                confirm_password: []
            }
        }
    },
    computed: {
        // ...mapGetters({
        //   hasIntegrationData: 'supabaseCreate/hasIntegrationData'
        // }),
        progress () {
            return ((Math.min(this.password.length, 8) / 8) + (this.special_characters.some(substring => this.password.includes(substring)))) * 50
        },
        color () {
            return ['primary', 'success'][Math.floor(this.progress / 100)]
        }
    },
    methods: {
        ...mapMutations({
            setJustRegistered: 'supabaseAuth/setJustRegistered'
        }),
        ...mapActions({
            fetchUserMeta: 'supabaseAuth/fetchUserMeta',
            fetchUserOrganizations: 'supabaseAuth/fetchUserOrganizations'
        }),
        async registerSubmit () {
            try {
                this.setJustRegistered(true)
                const { data: { user }, error } = await supabase.auth.signUp({
                    email: this.email,
                    password: this.password,
                    options: {
                        data: {
                            phone: this.phone,
                            name: this.name
                        }
                    }
                })

                if (error) {
                    throw error
                }

                try {
                    /**
                   * This just doesn't work right now.  Supabase-js v2 does not populate the page with a valid session until a user is confirmed by default now, with no way to change that option.
                   * So, the code will run here for reference in case that changes, but we need a new solution.
                   */
                    const notifystatus = await notify({
                        user_id: user.id,
                        action: 'signed_up'
                    })
                    console.log('notifystatus', notifystatus)
                } catch (error) {
                    this.$toast.error(error.message)
                    console.log(error)
                }

                console.log('Successfully registered user:', user)
                // A reminder to future devs that there is a postgres trigger to create user meta on signup, so this should be pretty reliable as long as the user got inserted.
                this.successMessage = 'Successful signup! Please check your email to confirm and continue.'
            } catch (error) {
                this.message = error.message
                console.log(error)
            }
        },
        registerValid () {
            this.loading = true
            // re-initialize all error messages back to default
            this.errorEmpty = false
            this.errorMatch = false
            this.errorLength = false
            this.errorSpecial = false

            // (1) text fields not empty
            if (this.name === '' || this.email === '' || this.password === '' || this.phone === '') {
                this.execute = false
                this.errorEmpty = true
                // console.log("Empty")
            }

            // (3) password 8 or more characters
            if (this.password.length < 8) {
                this.execute = false
                this.errorLength = true
                // console.log("Length")
            }

            // (4) password contains a special character
            let contains = false
            for (let i = 0; i < this.password.length; i++) {
                if (this.special_characters.includes(this.password.charAt(i)) === true) {
                    contains = true
                }
            }
            if (contains === false) {
                this.execute = false
                this.errorSpecial = true
                // console.log("Special")
            }

            // if conditions (1) - (4) true, register submit
            if (this.execute) {
                this.registerSubmit()
                this.loading = false
            } else {
                this.execute = true
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
  .v-toolbar--fixed {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bottom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 12px;
    border-radius: 20px 20px 0px 0px;
    z-index: 5;
  }
  h1 {
    margin-bottom: 12px;
  }
</style>
