<template>
  <v-bottom-navigation
    v-if="user && $vuetify.breakpoint.mobile"
    app
    grow
    color="primary"
  >
    <v-btn
      value="dashboard"
      to="/dashboard"
      height="56px"
    >
      <span>Dashboard</span>
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-btn
      value="add"
      to="/request/create"
      height="56px"
    >
      <span>New Request</span>
      <v-icon>mdi-plus-circle</v-icon>
    </v-btn>

    <v-btn
      value="settings"
      to="/settings"
      height="56px"
    >
      <span>Settings</span>
      <v-icon>mdi-cog</v-icon>
    </v-btn>
  </v-bottom-navigation>
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
