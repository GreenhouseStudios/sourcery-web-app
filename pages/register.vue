<template>
  <v-layout align-center justify-start column fill-height>
    <v-card flat height="380px">
      <v-form @submit.prevent="registerValid">
        <h1>Register</h1>
        <v-alert v-if="message" :value="true" type="error" class="mt-2 mb-2">{{message}}</v-alert>
        <v-text-field type="text" name="name" v-model="name" label="Name"></v-text-field>
        <span class="red--text" v-for="(err, index) in errors.name" :key="index">{{err}}</span>
        <v-text-field type="email" name="email" v-model="email" label="Email"></v-text-field>
        <span class="red--text" v-for="(err, index) in errors.email" :key="index">{{err}}</span>
        <v-layout>
          <v-flex>
            <v-text-field
              type="password"
              name="password"
              v-model="password"
              label="Password"
              autocomplete="false"
              hint="At least 8 characters"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-text-field
              type="password"
              name="confirm_password"
              v-model="confirm_password"
              label="Confirm Password"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <span class="red--text" v-for="(err, index) in errors.confirm_password" :key="index">{{err}}</span>
        <v-layout>
          <v-flex>
            <v-btn type="submit" value="Register" color="primary">Next</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card>
    
    
    <v-alert
        :value = errorEmpty
        type="warning"
        dismissible>
        <span color="white">All fields must be filled.</span>
    </v-alert>
    <v-alert
        :value = errorMatch
        type="warning"
        dismissible>
        <span color="white">Passwords do not match.</span>
    </v-alert>
    <v-alert
        :value = errorLength
        type="warning"
        dismissible>
        <span color="white">Password length must be atleast 8 characters.</span>
    </v-alert>
    <v-alert
        :value = errorSpecial
        type="warning"
        dismissible>
        <span color="white">Password must include a special character.</span>
    </v-alert>
   
  </v-layout>
</template>

<script>
import { Auth, db } from "~/plugins/firebase-client-init.js";

export default {
  name: "register",

  /**
   * Don't require auth for this page.
   */
  auth: false,
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      message: null,
      execute: true,

      errorEmpty: false,
      errorMatch: false,
      errorLength: false,
      errorSpecial: false,

      errors: {
        name: [],
        email: [],
        password: [],
        confirm_password: []
      },

      special_characters: ["~", "!", "@", "#", "$", "%","^", "&", "*", "_", "-", "+", "=", "`", "|", "(", ")", "{", "}", "[", "]", ":", ";", "'", "<", ">", ",", ".", "?", "/"],
    };
  },
  methods: {
    async registerSubmit() {
        let that = this;
      if (this.password !== this.confirm_password) {
        this.message = "Passwords must be the same";
      } else {
        Auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        ).then(({ user }) => {
            user.updateProfile({
                displayName: this.name,
                photoURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC',
            }).then(function(){
                that.$store.dispatch('signIn', {
                    email: that.email,
                    password: that.password
                }).then(function(){
                    that.$router.replace('/')
                });
            })

        }).catch(function(error) {
            let messages = {
                'auth/email-already-in-use': 'An account exists with this email address.',
                'auth/invalid-email': 'Please enter a valid email address.',
                'auth/operation-not-allowed': 'Uh oh.',
                'auth/weak-password': 'Please enter a stronger password.',
            };
            that.message = messages[error.code]
        });
      }
    },
    registerValid() {
      //re-initialize all error messages back to default
      this.errorEmpty = false;
      this.errorMatch = false;
      this.errorLength = false;
      this.errorSpecial = false;

      // (1) text fields not empty
      if (this.name == "" || this.email == "" || this.password == "" || this.confirm_password == "") {
        this.execute = false;
        this.errorEmpty = true;
        //console.log("Empty")
      }

      // (2) passwords match
      if (this.password !== this.confirm_password) {
        this.execute = false;
        this.errorMatch = true;
        //console.log("Match")
      }

      // (3) password 8 or more characters
      if (this.password.length < 8) {
        this.execute = false;
        this.errorLength = true;
        //console.log("Length")
      }

      // (4) password contains a special character
      var contains = false
      for (var i = 0; i < this.password.length; i++) {
          if (this.special_characters.includes(this.password.charAt(i)) == true)
            contains = true
    }
      if (contains == false) {
        this.execute = false
        this.errorSpecial = true;
        //console.log("Special")
      }

      //if conditions (1) - (4) true, register submit
      if (this.execute) {
        this.registerSubmit;
        //console.log("success")
      }
      else {
        this.execute = true;
      }
  }
  },
};
</script>

<style scoped>
</style>