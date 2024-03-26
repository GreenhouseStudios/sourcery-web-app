<template>
  <v-list-item two-line>
    <v-list-item-avatar
      :class="$vuetify.theme.dark ? 'secondary' : 'deep-purple lighten-5'"
      height="32px"
      rounded
    >
      <i :class="$vuetify.theme.dark ? `primary--text text--lighten-2 pf pf-${item.card.brand}` : `primary--text text--darken-2 pf pf-${item.card.brand}`" aria-hidden="true" :title="item.card.brand" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title
        class="font-weight-medium"
      >
        •••• •••• ••••  {{ item.card.last4 }}
      </v-list-item-title>
      <v-list-item-subtitle>
        Exp: {{ item.card.exp_month }}/{{ item.card.exp_year }}
      </v-list-item-subtitle>

      <v-flex />
    </v-list-item-content>
    <v-list-item-action>
      <v-btn v-if="index == 0" disabled text color="grey darken--2">
        default
      </v-btn>
      <v-btn
        color="primary"
        text
        @click="deleteCard(item.id)"
      >
        Remove
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            default: 0
        }
    },
    methods: {
        async deleteCard (id) {
            if (confirm('Are you sure you want to delete this card?')) {
                const stripeDeleteCard = this.$fire.functions.httpsCallable('stripeDeleteCard')
                const { data } = await stripeDeleteCard({ card_id: id })
                if (data.id) {
                    window.location.reload()
                }
            }
        }
    }
}
</script>
