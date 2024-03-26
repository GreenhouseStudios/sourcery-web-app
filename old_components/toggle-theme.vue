<template>
  <v-list-item>
    <v-list-item-avatar
      :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
    >
      <v-icon
        :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
      >
        mdi-brightness-7
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>Theme</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn-toggle v-model="theme" mandatory color="primary" @change="setTheme">
        <v-btn value="false" @click="$vuetify.theme.dark = false">
          <v-icon class="hidden-sm-and-down" left>
            mdi-brightness-7
          </v-icon>
          <span>Light</span>
        </v-btn>
        <v-btn value="true" @click="$vuetify.theme.dark = true">
          <v-icon class="hidden-sm-and-down" left>
            mdi-brightness-3
          </v-icon>
          <span>Dark</span>
        </v-btn>
        <!-- <v-btn value="null" @click="$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)')">
                  Auto
                </v-btn> -->
      </v-btn-toggle>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
    data: () => {
        return {
            theme: localStorage.getItem('dark_theme')
        }
    },
    methods: {
        setTheme () {
            localStorage.setItem('dark_theme', this.theme)
        }
    }
}
</script>
