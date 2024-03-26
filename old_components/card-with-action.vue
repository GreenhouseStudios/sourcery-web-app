<template>
  <v-card
    flat
    tile
    class="mb-4 rounded-lg pt-4 pb-3 pl-2 pr-2 card-with-action"
  >
    <v-card-title>
      <span class="text-uppercase text-h5">{{ titleText }}</span>
      <v-spacer />
      <nuxt-link :to="action" class="nounderline text-subtitle-1">
        More <v-icon small>
          mdi-arrow-right
        </v-icon>
      </nuxt-link>
    </v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'CardWithAction',
    props: {
        title: {
            type: String,
            required: true
        },
        numberRequests: {
            type: Number,
            default: 0
        },
        action: {
            type: String,
            default: '/dashboard'
        }
    },
    computed: {
        titleText () {
            let title = this.title
            if (this.numberRequests) {
                title += ` (${this.numberRequests})`
            }
            return title
        }
    }
}
</script>

<style scoped>
.nounderline {
  text-decoration: none;
}
</style>

<style>
.theme--light.card-with-action {
    background-color: #F5F5F5;
}
</style>
