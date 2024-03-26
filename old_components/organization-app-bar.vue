<template>
  <v-app-bar
    :src="organization.featured_image ? organization.featured_image.url : ''"
    app
    dark
    elevate-on-scroll
    :height="organization.featured_image ? '360px' : '240px'"
    class="pa-0"
  >
    <template #img="{ props }">
      <v-img
        v-bind="props"
        :gradient="organization.featured_image ? '0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%' : '0deg, rgba(146, 79, 190, 1) 0%, rgba(111, 77, 170, 1) 50%'"
      />
    </template>

    <v-container class="d-flex px-0" fill-height justify-space-between align-content-space-between>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mobile"
        color="primary"
        class="float-left"
        @click.stop="toggleDrawer()"
      />
      <v-spacer />
      <v-app-bar-title :class="user && $vuetify.breakpoint.smAndDown ? 'mt-2 ma-0 ml-n8' : 'mt-2 ma-0'">
        <nuxt-link id="wordmark-link" to="/dashboard">
          <img id="logo" :src="$vuetify.theme.dark ? '/img/wordmark-beta-dark.svg' : '/img/wordmark-beta.svg'" alt="Sourcery Logo">
        </nuxt-link>
      </v-app-bar-title>
      <v-spacer />
      <v-row class="align-self-end" align="center">
        <v-col>
          <h1
            v-if="organization"
            class="mb-2 text-h3 text-center font-weight-bold"
            style="text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25), 0px 8px 24px rgba(0, 0, 0, 0.1);"
          >
            {{ organization.name }}
          </h1>

          <h1
            v-else
          >
            Invalid Organization
          </h1>

          <p
            class="text-h5 text-center"
            style="text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25), 0px 8px 24px rgba(0, 0, 0, 0.1);"
          >
            {{ organization.address }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        organization: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        })
    },
    methods: {
        toggleDrawer () {
            this.$nuxt.$emit('toggle-nav-drawer')
        }
    }
}
</script>
