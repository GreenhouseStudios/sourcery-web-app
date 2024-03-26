<template>
  <v-card>
    <v-card-title class="text-h5">
      Add a new card
    </v-card-title>
    <v-card-text>
      <v-card flat color="transparent">
        <v-form @submit.prevent="addCard">
          <div class="form-row">
            <!-- Used to display form errors. -->
            <v-alert
              id="card-errors"
              :value="error"
              type="error"
              class="my-2"
              role="alert"
            >
              {{ error.message }}
            </v-alert>

            <v-text-field v-model="nameOnCard" type="text" name="name" label="Name on Card" />
            <div ref="card" class="mt-3">
              Loading...
            </div>
          </div>

          <v-checkbox
            v-model="agree"
            label="I permit Sourcery to use this card for payments."
            hint="You are authorizing Sourcery to send instructions to the financial institution that issued my card to take payments from my card account in accordance with the terms of my agreement with you."
            :persistent-hint="true"
          />
          <p class="text-caption my-2" />

          <v-layout
            class="mt-4"
            justify-end
          >
            <v-btn
              class="primary"
              type="submit"
              :loading="loading"
              :disabled="!agree"
              @click="dialog=true"
            >
              Add Card
            </v-btn>
          </v-layout>
        </v-form>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'AddCard',
    data () {
        return {
            cardElement: null,
            nameOnCard: this.$store.getters['auth/activeUser'].displayName,
            error: false,
            setupIntents: this.$fire.functions.httpsCallable('stripeSetupIntents'),
            saveCard: this.$fire.functions.httpsCallable('stripeSaveCard'),
            agree: false,
            client_secret: false,
            loading: false,
            show: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/activeUser',
            isResearcher: 'meta/isResearcher',
            isSourcerer: 'meta/isSourcerer',
            balance: 'meta/balance',
            canMakePayments: 'meta/canMakePayments'
        })
    },
    // async mounted () {
    //     // Get the client secret and store it
    //     const { data: { client_secret } } = await this.setupIntents()
    //     this.client_secret = client_secret

    //     // Setup the card element for stripe
    //     // Get a previously generated card, if it exists.
    //     this.cardElement = elements.getElement('card') || elements.create('card', {
    //         style: {
    //             base: {
    //                 color: '#32325d',
    //                 fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //                 fontSmoothing: 'antialiased',
    //                 fontSize: '16px',
    //                 '::placeholder': {
    //                     color: '#aab7c4'
    //                 }
    //             },
    //             invalid: {
    //                 color: '#fa755a',
    //                 iconColor: '#fa755a'
    //             }
    //         }
    //     })
    //     if (typeof this.$refs.card !== 'undefined') {
    //         this.cardElement.mount(this.$refs.card)
    //     } else {
    //         console.warn('this.$refs.card is not defined', this.$refs)
    //     }
    // },
    methods: {
        // addCard () {
        //     this.loading = true
        //     stripe.confirmCardSetup(
        //         this.client_secret,
        //         {
        //             payment_method: {
        //                 card: this.cardElement,
        //                 billing_details: {
        //                     name: this.nameOnCard
        //                 }
        //             }
        //         }
        //     ).then((result) => {
        //         if (result.error) {
        //             this.error = result.error
        //             this.loading = false
        //         } else {
        //             // The setup has succeeded. Display a success message and send
        //             // result.setupIntent.payment_method to your server to save the
        //             // card to a Customer
        //             console.log('Success', result)
        //             this.saveCard({
        //                 customer: this.$store.state.meta.stripeCustomerId,
        //                 payment_method: result.setupIntent.payment_method
        //             }).then(async (result) => {
        //                 if (result.data.object === 'customer') {
        //                     this.$store.commit('meta/setStripeCustomerId', result.data.id)
        //                     await this.$store.dispatch('meta/save', 'stripeCustomerId')
        //                 }
        //                 this.cardAdded()
        //             })
        //         }
        //     })
        // },
        /** Runs when a card is successfully added */
        cardAdded () {
            this.$emit('done')
            this.loading = false
            this.agree = false
            this.cardElement.clear()
        }
    }
}
</script>

<style scoped>
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
