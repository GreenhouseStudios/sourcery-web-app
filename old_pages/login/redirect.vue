<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Redirecting You</h3>
        <p>Signing you in, just a moment....</p>
        <p>
          If this page does not redirect, it's possible you used an expired or malformed link. Please proceed to <NuxtLink to="/login">
            the login page
          </NuxtLink>.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser'
        })
    },
    mounted () {
        const urlParams = new URLSearchParams(this.$route.fullPath.split('#')[1])
        const type = urlParams.get('type')

        if (type === 'invite') {
            this.$router.push('/settings')
        } else if (this.authUser) {
            this.$router.push('/dashboard')
        }
    }
}
</script>
