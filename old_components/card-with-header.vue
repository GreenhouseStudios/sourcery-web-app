<template>
  <v-card
    flat
    tile
    color="transparent"
    class="mb-4"
  >
    <v-card-title
      :class="$vuetify.theme.dark ? 'text-h5 font-weight-bold pa-6 primary--text text--lighten-2 secondary rounded-lg' : 'text-h5 font-weight-bold pa-6 primary--text deep-purple lighten-5  rounded-lg'"
    >
      {{ title }}
      <v-spacer />
      <v-icon
        v-if="icon"
        :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text'"
      >
        {{ icon }}
      </v-icon>
    </v-card-title>
    <slot />
  </v-card>
</template>

<script>
export default {
    name: 'SourceryCard',
    props: {
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false,
            default: ''
        }
    },

    data () {
        return {
        }
    }
}
</script>

<style>
@media print {
  .text-h5 {
    color: purple !important;
    opacity: 1 !important;
  }
}
</style>
