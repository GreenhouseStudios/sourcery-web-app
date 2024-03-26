<template>
  <v-list-item>
    <v-list-item-avatar
      :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
    >
      <v-icon
        :class="$vuetify.theme.dark ? 'primary--text text--lighten-2' : 'primary--text text--darken-2'"
      >
        mdi-bell
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>Notifications</v-list-item-title>
      <v-list-item-subtitle>Receive promotional notifications.</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-switch
        v-model="agentBool"
        :hint="alertHint"
        :persistent-hint="false"
        color="primary"
        inset
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
    data: () => {
        return {
            alertHint: 'Please choose "Allow" if prompted by your device/browser.'
        }
    },
    computed: {
        agentBool: {
            get () {
                return this.$store.state.meta.agentUpdates
            },
            set (value) {
                this.updateNotifications(value)
            }
        }
    },
    methods: {
        async updateNotifications (value) {
            this.$store.commit('meta/setAgent', value)
            await this.$store.dispatch('meta/save', 'agentUpdates')
            this.$toast.success('Notification preference successfully saved.')
        }
    }
}
</script>
