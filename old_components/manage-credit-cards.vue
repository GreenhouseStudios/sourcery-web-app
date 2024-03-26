<template>
  <div>
    <v-list
      v-if="cards.data.length"
      two-line
      subheader
      color="transparent"
    >
      <v-subheader>
        Cards
      </v-subheader>
      <credit-card-list-item
        v-for="(item, index) in cards.data"
        :item="item"
        :index="index"
      />
    </v-list>
    <v-list
      v-else
      color="transparent"
    >
      <v-subheader>
        Cards
      </v-subheader>
      <v-list-item>
        <v-list-item-title>
          You have no cards on file.
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list color="transparent">
      <v-list-item dense>
        <v-list-item-title />
        <v-list-item-action>
          <v-spacer />
          <v-btn
            color="primary"
            outlined
            @click="addCardDialogOpen = !addCardDialogOpen"
          >
            Add Card
          </v-btn>
          <v-dialog v-model="addCardDialogOpen" width="450" max-width="100%">
            <!-- <add-card @done="done" /> -->
            Coming soon.
          </v-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
// import AddCard from '@/components/add-card.vue'
import CreditCardListItem from '@/components/credit-card-list-item.vue'

export default {
    components: {
        // AddCard,
        CreditCardListItem
    },
    props: {
        initialCards: {
            type: Object,
            default: () => {
                return {
                    data: []
                }
            }
        }
    },
    data () {
        return {
            cards: Object.assign({}, this.initialCards),
            addCardDialogOpen: false
        }
    },
    methods: {
        done () {
            this.addCardDialogOpen = false
            window.location.reload()
        }
    }
}
</script>
