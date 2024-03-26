<template>
  <v-dialog
    v-model="open"
    max-width="600"
  >
    <v-card>
      <v-card-title>Request Limit Reached</v-card-title>
      <v-card-text>
        <p>You have reached the maximum request limit for an account without a password.  Please set a password before submitting another request.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          text
          nuxt
          to="/settings"
        >
          Visit Settings
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data: () => {
        return {
            open: false
        }
    },
    methods: {
        openDialog () {
            this.open = true
        },
        closeDialog () {
            this.open = false
        }
    }
}
</script>
