<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Settings
      </h1>
      <sourcery-card title="General" icon="mdi-cog">
        <v-list
          color="transparent"
        >
          <toggle-theme />
          <!-- <toggle-notifications /> -->
        </v-list>
      </sourcery-card>
      <sourcery-card title="Profile" icon="mdi-account-details">
        <v-list
          color="transparent"
        >
          <dialog-edit-setting
            title="Name"
            icon="mdi-account"
            label="Your Name"
            property-name="name"
            vuex-root="supabaseAuth/authUserMeta"
            vuex-action="supabaseAuth/updateMeta"
            toast-success="Saved name successfully."
            :rules="[$sourceryForms.rules.required]"
          />

          <dialog-edit-password />

          <dialog-readonly-setting
            title="Email"
            icon="mdi-email"
            label="Email"
            propertyName="email"
            vuexRoot="supabaseAuth/authUserMeta"
          />

          <dialog-edit-setting
            title="Phone"
            icon="mdi-phone"
            label="Display Phone Number"
            property-name="phone"
            vuex-root="supabaseAuth/authUserMeta"
            vuex-action="supabaseAuth/updateMeta"
            toast-success="Saved phone successfully."
            :rules="[$sourceryForms.rules.required]"
          />
        </v-list>
      </sourcery-card>
      <sourcery-card title="Payment Information" icon="mdi-credit-card-outline">
        <manage-credit-cards
          v-if="false"
          :initial-cards="cards"
        />
        <p class="pt-3 pl-3">
          Coming back soon!
        </p>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import SourceryCard from '@/components/card-with-header.vue'
import ToggleTheme from '@/components/toggle-theme.vue'
// import ToggleNotifications from '@/components/toggle-notifications.vue'
import DialogEditSetting from '@/components/dialog-edit-setting.vue'
import DialogReadonlySetting from '@/components/dialog-readonly-setting.vue'
import DialogEditPassword from '@/components/dialog-edit-password.vue'
import ManageCreditCards from '@/components/manage-credit-cards.vue'

export default {
    name: 'Settings',
    components: {
        SourceryCard,
        ToggleTheme,
        // ToggleNotifications,
        DialogEditSetting,
        DialogReadonlySetting,
        DialogEditPassword,
        ManageCreditCards
    },
    async asyncData ({ params, store, app }) {
        // const stripeGetPaymentMethods = app.$fire.functions.httpsCallable('stripeGetPaymentMethods')
        // const customer_id = store.state.meta.stripeCustomerId

        // Not gonna lie, slight hack here.  Sometimes, eat least in local development, there was a chance we haven't populated all the auth data by the time these components attempt to reach vuex-root.  Could quite literally be a $tick problem, so this just guarantees one more.
        await store.dispatch('supabaseAuth/fetchUserMeta')

        return {
            cards: /* (store.state.meta.stripeCustomerId)
                ? (await stripeGetPaymentMethods({ customer: customer_id, type: 'card' })).data
                : */ { data: [] }
        }
    },
    data () {
        return {
            cards: {
                data: []
            }
        }
    }
}
</script>

<style scoped>

.v-dialog > .v-card > .v-card__title {
    padding: 16px;
}

.v-dialog > .v-card > .v-card__text {
  padding: 16px;
}

.theme--light.v-btn-toggle:not(.v-btn-toggle--group) .v-btn.v-btn .v-icon {
  color: inherit
}

.v-expansion-panel {
  background: transparent !important
}

.v-expansion-panel-header {
  padding: 16px;
}

</style>
