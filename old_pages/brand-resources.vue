<template>
  <div class="page-container">
    <div id="content-wrap" class="mb-8 px-4">
      <sourcery-header class="mx-n4" />
      <v-layout>
        <v-flex
          xs12
          sm8
          md6
          offset-sm3
          offset-md3
        >
          <h1 class="text-center my-24 page-title">
            Brand Resources
          </h1>

          <div class="selection-area">
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>Customize Button</v-card-title>
                  <v-card-text class="d-flex justify-center">
                    <button-request-sourcery ref="request_button_example" :dark="dark" :rounded="rounded" />
                  </v-card-text>
                  <v-card-text>
                    <v-btn color="primary" @click="getMarkup">
                      {{ getMarkupButtonText }}
                    </v-btn>
                  </v-card-text>
                  <v-card-text class="">
                    <h3>Button HTML</h3>
                    <copy-text-box :text="markupText" :default-text="`Press ${getMarkupButtonText} to retrieve code to copy.`" />
                  </v-card-text>
                  <v-card-text>
                    <h3>Bonus: Hover CSS</h3>
                    <copy-text-box :text="hoverCSS" :default-text="`Press ${getMarkupButtonText} to retrieve code to copy.`" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-switch
                  v-model="dark"
                  :label="`Dark`"
                />
                <v-switch
                  v-model="rounded"
                  :label="`Rounded`"
                />
              </v-col>
            </v-row>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <sourcery-footer id="footer" />
  </div>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/purple-header.vue'

export default {
    components: {
        'sourcery-footer': Footer,
        'sourcery-header': Header
    },
    layout: 'landing-beta',
    data () {
        return {
            dark: false,
            rounded: false,
            markupText: '',
            hoverCSS: ''
        }
    },
    computed: {
        getMarkupButtonText () {
            if (!this.markupText) {
                return 'Get Code'
            }
            return 'Update Code'
        }
    },
    methods: {
        getMarkup () {
            this.markupText = this.$refs.request_button_example?.markup
            this.hoverCSS = this.$refs.request_button_example?.hoverCSS
        }
    }
}
</script>
