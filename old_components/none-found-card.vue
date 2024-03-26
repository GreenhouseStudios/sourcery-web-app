<template>
  <v-card class="my-4 rounded-lg" outlined>
    <v-container>
      <v-row>
        <v-col class="pa-0">
          <v-card-subtitle>{{ text }}</v-card-subtitle>
        </v-col>
        <v-col
          v-if="to"
          cols="auto"
          class="d-flex align-center justify-center rounded-r-lg px-4"
          z-index="2"
          :style="'background: var(--sourcery-500'"
        >
          <NuxtLink
            class="font-weight-bold text-button ma-0 text-decoration-none"
            :class="
              $vuetify.theme.dark ? 'black--text' : 'white--text'
            "
            :to="to"
          >
            <slot />
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: false,
            default: null
        }
    }
}
</script>
