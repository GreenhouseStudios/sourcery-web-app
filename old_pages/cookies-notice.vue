<template>
  <v-layout column>
    <h1>Cookies Notice</h1>

    <p>
      We use cookies on this website (“Site”) that are necessary with respect to use of the Site itself and to provide other services requested by you.  We also use cookies to improve/enhance your user experience such as by setting your language preference or remembering your password or location, to collect information about your use of our Site to analyze certain of your activities to help us understand how visitors interact with our Site, and to track visitors' activities on our Site and across websites to display ads that may be relevant to particular users. Details about our use of cookies, and your rights relating to the same, are described more specifically in our <nuxt-link to="/privacy">
        Privacy Policy
      </nuxt-link>.
    </p>
    <p>If you do not click OK, and you then click on any other link, icon, button or page on this Site (except the link to our Privacy Policy), your further use of the Site will be deemed to be agreement by you to the use of all of those cookies in accordance with our Privacy Policy relating to cookies.</p>
  </v-layout>
</template>

<script>
export default {
    data () {
        return {
            sourceryEmail: 'support@sourceryapp.org'
        }
    },
    computed: {
        baseURL: () => process.env.BASE_URL
    },
    methods: {
        email () {
            return `<a href="mailto:${this.sourceryEmail}">${this.sourceryEmail}</a>`
        }
    }
}
</script>

<style scoped>
</style>
