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
            Sourcery's Roadmap
          </h1>
          <div id="path-bg">
            <v-row class="align-center">
              <v-col
                class="col-12 col-sm-6 d-flex justify-center"
              >
                <img
                  class="roadmap-image"
                  src="../public/img/roadmap-illustrations/1.svg"
                  alt=""
                >
              </v-col>
              <v-col class="order-sm-first col-12 col-sm-6">
                <div class="">
                  <h2 class="date mb-2">
                    Winter-Spring 2024
                  </h2>
                  <p>
                    Release of Archivesspace plugin.
                  </p>
                  <p>
                    Launch of Sourcery Anywhere (support for requests nationwide).
                  </p>
                  <p>
                    Release of Android native application.
                  </p>
                  <p>
                    Release of "Request with Sourcery" HTML buttons.
                  </p>
                  <p>
                    Support for line breaks &amp; basic rich text in request details.
                  </p>
                </div>
              </v-col>
            </v-row>
            <v-row class="align-center">
              <v-col
                class="col-12 col-sm-6 d-flex justify-center"
              >
                <img
                  class="roadmap-image"
                  src="../public/img/roadmap-illustrations/2.svg"
                  alt=""
                >
              </v-col>
              <v-col class="col-12 col-sm-6">
                <div class="">
                  <h2 class="date mb-2">
                    Summer-Fall 2024
                  </h2>
                  <p>
                    Launch of minimal computing version for users in low-bandwidth areas.
                  </p>
                  <p>
                    Release of Tropy plugin.
                  </p>
                  <p>
                    Support for institutional analytics.
                  </p>
                </div>
              </v-col>
            </v-row>
            <v-row class="align-center">
              <v-col
                class="col-12 col-sm-6 d-flex justify-center"
              >
                <img
                  class="roadmap-image"
                  src="../public/img/roadmap-illustrations/3.svg"
                  alt=""
                >
              </v-col>
              <v-col class="order-sm-first col-12 col-sm-6">
                <div class="">
                  <h2 class="date mb-2">
                    2025 and Beyond
                  </h2>
                  <p>
                    Launch of in-app payments.
                  </p>
                  <p>
                    Pilot launch of third-party, peer-to-peer scanning services.
                  </p>
                </div>
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
/**
 * Cookie Consent
 * @url https://github.com/apertureless/vue-cookie-law#--vue-cookie-law
 */
import Footer from '../components/footer'
import Header from '../components/purple-header.vue'

export default {
    name: 'Roadmap',
    components: {
        'sourcery-footer': Footer,
        'sourcery-header': Header
    },
    layout: 'landing-beta',
    middleware: null,
    data () {
        return {
        }
    },
    head () {
        return {
            script: [
                {
                    src:
                        'https://cdnjs.cloudflare.com/ajax/libs/stickybits/3.7.2/stickybits.min.js',
                    integrity:
                        'sha256-pytD+8MI6QUO5dayaQjTboZuqXv8YU05ZuQFl4NijpM=',
                    crossorigin: 'anonymous'
                }
            ]
        }
    },
    mounted () {},
    methods: {
    }
}
</script>

<style>
.page-container {
  position: relative;
  min-height: 100vh;
}
#content-wrap {
  padding-bottom: 160px;    /* Footer height */
}
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>

<style scoped>
.date {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-size: 2rem;
}
.roadmap-image {
  width: auto;
  max-width: 100%;
  height: 100%;
}

#path-bg {
  background: url('../public/img/roadmap-illustrations/path.svg');
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 80%;
}
</style>
