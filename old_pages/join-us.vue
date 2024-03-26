<template>
  <div class="page-container">
    <div id="content-wrap" class="px-4">
      <sourcery-header class="mx-n4" />
      <v-layout v-if="!formSubmitted">
        <v-flex xs12 sm6 xl4 offset-sm3 offset-xl4>
          <h1 class="text-center my-24 text-h2 font-weight-medium">
            Join Us
          </h1>
          <p>Fill out the form below if you are interested in joining us as an institution or as a researcher during our testing phase.</p>
          <join-us-form @submit-form="formClose()" />
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <v-flex
          xs12
          sm6
          xl4
          offset-sm3
          offset-xl4
          class="text-center"
        >
          <h1 class="my-24 text-h2 font-weight-medium">
            You're all set!
          </h1>
          <p class="font-weight-medium">
            Keep an eye out for an email at your institutional email inbox over the next few days for a link to finalize your account.
          </p>
          <v-btn to="/" color="primary" x-large class="my-6">
            Return to home page
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
    <sourcery-footer id="footer" />
  </div>
</template>

<script>
import Footer from '~/components/footer'
import Header from '~/components/purple-header.vue'
import JoinUsForm from '~/components/join-us-form.vue'

export default {
    components: {
        'sourcery-footer': Footer,
        'sourcery-header': Header,
        'join-us-form': JoinUsForm
    },
    layout: 'landing-beta',
    data: () => ({
        formSubmitted: false
    }),
    methods: {
        formClose () {
            this.formSubmitted = true
        }
    }
}
</script>

<style>
.page-container {
  position: relative;
  min-height: 100vh;
}
#content-wrap {
  padding-bottom: 260px;    /* Footer height (160) + extra */
}
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
