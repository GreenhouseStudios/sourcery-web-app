<template>
  <v-card
    v-if="!user"
    outlined
  >
    <v-card-title>You are Logged Out</v-card-title>
    <v-card-text>
      <span>Please <NuxtLink to="/login">log in</NuxtLink> to access the full set of features in Sourcery.</span>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        })
    }
}
</script>
