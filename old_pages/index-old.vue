<template>
  <div id="content" class="site-content">
    <div class="fixed-header" style="position:fixed;width:100%;z-index:1;">
      <div v-if="isIntersecting" class="top-callout-banner">
        <p class="white--text">
          Something's brewing...stay tuned to our new <a href="https://sourceryapp.substack.com/" class="white--text" target="_blank">blog</a>!
        </p>
      </div>

      <v-fade-transition>
        <sourcery-header
          v-if="!isIntersecting"
          style="width: 100%"
        />
      </v-fade-transition>
    </div>

    <header
      v-intersect="onIntersect"
      class="landing-header"
    >
      <div class="header-content pt-9 mt-4">
        <img
          class="header__logo"
          src="../public/img/logo-wordmark-white.svg"
          alt=""
        >
        <img
          class="header__mockup"
          src="~/assets/doublephone-sourcery-02-compressed.png"
          alt=""
        >
        <div class="header__callout">
          <!-- <v-btn
            to="/register"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
            depressed
          >
            Sign Up
          </v-btn> -->
          <!-- <v-btn
            to="/join-us"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
          >
            Sign Up
          </v-btn> -->
          <!-- <v-btn
            to="/login"
            x-large
            block
            color="white"
            class="black--text text-h5 font-weight-bold"
            height="76px"
            outlined
          >
            Log In
          </v-btn> -->
          <p class="mt-2 text-white top-callout-text">
            Remote access to archival documents.
          </p>
        </div>
        <div class="header__slogan">
          <p>
            Open source
            <SvgsSparkle height="10" class="svg-sparkle-contain" />
            Not for profit
            <SvgsSparkle height="10" class="svg-sparkle-contain" />
            Community Driven
          </p>
        </div>
        <div class="header__cta-button-group">
          <v-btn outlined x-large dark @click="showDialog">
            Register
          </v-btn>
          <v-btn outlined x-large to="/login" dark>
            Login
          </v-btn>
        </div>
      </div>
    </header>

    <v-flex
      xs12
      sm10
      md8
      lg6
      xl4
      offset-sm1
      offset-md2
      offset-lg3
      offset-xl4
    >
      <v-container class="py-8">
        <h1 id="meet" class="mt-8">
          How Sourcery Can Work for Your Institution
        </h1>

        <v-row align="center" class="mb-5">
          <v-col md="2" cols="12" :align="calloutAlignment">
            <SvgsHomepage-Optimize />
          </v-col>
          <v-col offset-md="1" md="9" cols="12" :align="calloutAlignment">
            <h2 class="light-purple">
              Optimize your Research Requests Workflow
            </h2>
            <p>Manage requests for document scans and other researcher requests from a simple, intuitive dashboard. Fulfill requests on any device connected to the internet with the device's camera or by uploading a pdf, jpg, png, or other file.</p>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-5">
          <v-col md="2" cols="12" :align="calloutAlignment">
            <SvgsHomepage-Communicate />
          </v-col>
          <v-col offset-md="1" md="9" cols="12" :align="calloutAlignment">
            <h2 class="light-purple">
              Communicate Directly
            </h2>
            <p>Ask and answer questions, make clarifications, and more through the in-app, per-request message feature. Declutter your inbox and streamline correspondance right in the app.</p>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-5">
          <v-col md="2" cols="12" :align="calloutAlignment">
            <SvgsHomepage-Analytics />
          </v-col>
          <v-col offset-md="1" md="9" cols="12" :align="calloutAlignment">
            <h2 class="light-purple">
              Access Rich Usage Analytics
            </h2>
            <p>See your institution's average turnaround time, most common file type requests, geographical areas of requests, new and repeat requesters, average file size, and more from the Institutional Analytics feature.</p>
          </v-col>
        </v-row>

        <!-- <v-row align="center" class="mb-5">
          <v-col md="2" cols="12" :align="calloutAlignment">
            <SvgsHomepage-Interface />
          </v-col>
          <v-col offset-md="1" md="9" cols="12" :align="calloutAlignment">
            <h2 class="light-purple">
              Request from a Single Interface
            </h2>
            <p>Say goodbye to remembering multiple usernames and passwords for different institutional portals. Submit requests to any of our partner institutions on a single interface and manage them on one dashboard.</p>
          </v-col>
        </v-row>         -->
      </v-container>
    </v-flex>
    <section id="how-does-sourcery-work">
      <div class="section-container">
        <v-container>
          <v-row class="align-center">
            <v-col>
              <img
                class="section-img"
                src="../public/img/landing-illustrations/undraw_faq_rjoy.svg"
                alt=""
              >
            </v-col>
            <v-col class="order-sm-first col-12 col-sm-6">
              <h1 id="how" ref="how" class="text">
                How does Sourcery work?
              </h1>
            </v-col>
          </v-row>
        </v-container>
        <div class="paragraphs">
          <p class="medium">
            The Sourcery app allows researchers to request documents
            directly from our affiliated institutions through a single login and interface,
            accessible from any device.
            It aims to streamline the process for both researchers and repositories,
            offering a simple request and fulfillment workflow and a seamless, secure payments system.
          </p>
          <img
            src="../public/img/sparkle-circle.svg"
            class="sparkle"
            :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"
          >
          <p class="text indiv">
            Sourcery is a not-for-profit service that gives researchers
            access to documents that can't be found online.
            During the beta period, users can request documents from select institutions.
            Just provide the document’s citation information, and Sourcery will do the rest.
          </p>
          <img
            src="../public/img/sparkle-circle.svg"
            class="sparkle"
            :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"
          >
          <p class="text indiv">
            Sourcery emerges from the design process of
            <a
              href="https://greenhousestudios.uconn.edu/"
              class="partnerlink"
            >Greenhouse Studios</a>
            and from the project team’s past work and ongoing
            interests in research software for the humanities.
            Greenhouse Studios, an incubator for digital scholarship
            at the University of Connecticut, is a shared initiative
            of the
            <a
              href="https://lib.uconn.edu/"
              class="partnerlink"
            >UConn Library</a>,
            <a
              href="https://sfa.uconn.edu/"
              class="partnerlink"
            >School of Fine Arts</a>, and the
            <a
              href="https://clas.uconn.edu/"
              class="partnerlink"
            >College of Liberal Arts and Sciences</a>. Sourcery is a project of the
            <a
              href="https://digitalscholar.org/"
              class="partnerlink"
            >
              Corporation for Digital Scholarship</a>, a not-for-profit organization.
          </p>
        </div>
      </div>
    </section>

    <section id="cta">
      <div class="section-container">
        <v-container>
          <v-row class="align-center">
            <v-col>
              <img
                src="../public/img/landing-illustrations/undraw_enter_uhqk.svg"
                alt=""
                class="section-img ready-img"
              >
            </v-col>
            <v-col class="order-sm-first col-12 col-sm-6 px-0">
              <h1 id="ready">
                Ready to try Sourcery?
              </h1>
              <v-col id="button-wrap" class="px-0">
                <v-col>
                  <v-btn
                    to=""
                    color="primary"
                    x-large
                    height="76px"
                    block
                    @click="showDialog"
                  >
                    Register
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    to="/login"
                    x-large
                    block
                    color="primary"
                    height="76px"
                    outlined
                  >
                    Log In
                  </v-btn>
                </v-col>
              </v-col>
              <v-col id="learn-more" class="text-center">
                <v-btn
                  to="/about"
                  text
                  color="white"
                >
                  Learn More
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-dialog v-model="dialogVisible" width="650">
        <v-card id="modal-card">
          <v-card-title>
            <h3 id="ready">
              Ready to try Sourcery?
            </h3>
          </v-card-title>
          <v-card-text>
            <v-container class="pb-0">
              <v-row>
                <v-col cols="12">
                  <h2 id="modal-subtitle">
                    I am looking to...
                  </h2>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="auto" class="modal-button-wrap">
                  <v-btn
                    to="/register"
                    x-large
                    color="rgb(146, 79, 190)"
                    height="300"
                    class="modal-button"
                  >
                    <div class="modal-button-content">
                      <img
                        src="@/public/img/icons_document.png"
                        height="180"
                      >
                      <span class="modal-button-text">
                        Request Documents
                      </span>
                    </div>
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="modal-button-wrap">
                  <v-btn
                    to="/join-us"
                    x-large
                    color="rgb(146, 79, 190)"
                    height="300"
                    class="modal-button"
                  >
                    <div class="modal-button-content">
                      <img
                        src="@/public/img/icons_institution.png"
                        height="160"
                      >
                      <span class="modal-button-text">
                        Become a Partner Institution
                      </span>
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <span class="login-link-text">
                    Have an account?
                    <NuxtLink to="/login">
                      Log in.
                    </NuxtLink>
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn rounded @click="dialogVisible = false">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>

    <sourcery-footer :text="true" />
  </div>
</template>

<script setup>
definePageMeta({
    layout: 'landing'
})
</script>

<script>
import Footer from '../components/footer'
import Header from '../components/purple-header.vue'

export default {
    name: 'Home',
    components: {
        CookieLaw,
        'sourcery-footer': Footer,
        'sourcery-header': Header
    },
    layout: 'landing-beta',
    middleware: null,
    data: () => ({
        isIntersecting: true,
        dialogVisible: false
    }),
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
    computed: {
        isProd () {
            if (process.env.BASE_URL && process.env.BASE_URL === 'https://sourceryapp.org') {
                return true
            }
            return false
        },
        calloutAlignment () {
            if (this.$vuetify.breakpoint.smAndDown) {
                return 'center'
            }
            return ''
        }
    },
    methods: {
        smoothScroll (target) {
            let scrollContainer = target
            do {
                // find scroll container
                scrollContainer = scrollContainer.parentNode
                if (!scrollContainer) {
                    return
                }
                scrollContainer.scrollTop += 1
            } while (scrollContainer.scrollTop === 0)

            let targetY = 0
            do {
                // find the top of target relatively to the container
                if (target === scrollContainer) {
                    break
                }
                targetY += target.offsetTop
            } while ((target = target.offsetParent))

            const scroller = function (c, a, b, i) {
                i++
                if (i > 30) {
                    return
                }
                c.scrollTop = a + ((b - a) / 30) * i
                setTimeout(function () {
                    scroller(c, a, b, i)
                }, 20)
            }
            // start scrolling
            scroller(scrollContainer, scrollContainer.scrollTop, targetY, 0)
        },
        onIntersect (entries, observer) {
            this.isIntersecting = entries[0].isIntersecting
        },
        showDialog () {
            this.dialogVisible = true
        }
    }
}
</script>

<style>
body {
    --sourcery-500: #654ea3;
    --sourcery-700: #413268;
    --sourcery-900: #292043;
    --max-width: 940px;
}
.Cookie--dark-lime a.Cookie__button {
    background-color: grey;
}
body {
    margin: 0;
}
p {
    font-size: 18px;
    margin: 0;
    color: var(--v-primary-base);
}
h1 {
    font-size: 32px;
    line-height: 38px;
}
.color-500 {
  color: var(--sourcery-500)
}
.color-700 {
    color: var(--sourcery-700);
}
.color-900 {
    color: var(--sourcery-900);
}
#meet {
  font-family: 'Barlow', sans-serif;
  font-weight: 500;
  font-size: 36px;
  text-align: center;
  margin-bottom: 48px;
}
.landing-header {
    padding: 48px 24px;
    background: rgb(146, 79, 190);
    background: linear-gradient(
        112deg,
        rgba(166, 109, 171, 1) 0%,
        rgba(104, 81, 164, 1) 100%
    );
}
.header-content {
    max-width: var(--max-width);
    margin: 0 auto;
    display: grid;
    align-items: center;
    grid-template-areas: 'logo' 'mockup' 'slogan' 'callout' 'buttons';
    row-gap: 2px;
}
.header__logo {
    width: 100%;
    max-width: 510px;
    grid-area: logo;
}
.header__mockup {
    width: auto;
    padding: 24px 0;
    grid-area: mockup;
    filter: drop-shadow(16px 8px 8px rgb(41, 32, 67, 0.3));
    max-height: 400px;
    margin: 0 auto;
}
.header__cta-button-group {
    grid-area: buttons;
    /* padding-top: 20px;
    padding-bottom: 10px; */
}
.header__callout {
  grid-area: callout;
  margin-bottom: 10px;
}
.header__slogan {
    grid-area: slogan;
    color: white;
}
.header__slogan h1 {
    margin-bottom: 12px;
}
.header__slogan p {
    color: white;
    font-size: 17px;
    text-transform: uppercase;
    margin-bottom: 0;
}
.text-white {
  color: white;
}
.text-white .link-white {
  color: white;
}
.section-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 48px 24px;
}
.feature:not(:last-child) {
    margin-bottom: 24px;
}
.feature-illustration {
    width: 100%;
    padding: 24px;
}
.feature-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
}
.feature-text {
    font-weight: 500;
}
#how-does-sourcery-work {
    background: hsla(260, 75%, 75%, 0.05);
}
.section-img {
    width: 100%;
    padding: 24px;
}
#how {
    margin-bottom: 12px;
}
.medium {
    font-weight: 500;
}
.sparkle {
    display: block;
    margin: 18px auto;
    background-color: white;
    border-radius: 50%;
}
.paragraphs {
    margin-bottom: 24px;
}
.ready-img {
    height: 300px;
}
.cta-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 48px;
    justify-content: space-between;
    align-content: space-around;

}

.cta-buttons .v-btn {
  min-width: 350px;
}

#ready {
    font-size: 28px;
    padding-inline: 12px;
    margin-bottom: 12px;
}

#learn-more {
  text-decoration: underline;
}
.login-link-text {
  font-size: 18px;
  display: inline-block;
  color: white;
  margin-right: 10px; /* adjust as needed */
}

#modal-subtitle {
  color: white;
  text-transform: uppercase;
}

.modal-button-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-button {
  width: 260px;
}

.modal-button-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: auto;
  width: 250px;
}

.modal-button-text {
  color: white;
  margin-top: 30px;
  font-size: 20px;
  white-space: normal;
  text-align: center;
}

@media only screen and (min-width: 600px) {
    #button-wrap {
      display: flex;
      flex-direction: row;
    }
    #ready {
      font-size: 32px;
      margin-bottom: 24px;
    }
    .landing-header {
        padding: 96px 24px;
    }
    .header-content {
        grid-template-areas: '. mockup' 'logo mockup' 'slogan mockup' 'callout mockup' 'buttons mockup' '. mockup';
        column-gap: 96px;
        grid-template-columns: 6fr 4fr;
        grid-template-rows: 1fr auto auto auto auto 1fr;
    }
    .header__mockup {
        padding: 0;
        width: auto;
        max-width: 100%;
        object-fit: contain;
        max-height: initial;
    }
    .header__slogan {
      margin-bottom: 10px;
    }
    .feature {
        height: 240px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
    }
    .feature-illustration {
        flex: 1;
        height: 100%;
    }
    .feature__text-first .feature-desc {
        order: -1;
    }
    .feature-desc {
        flex: 1;
    }
    .section-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
    }
    .section-img {
        width: 100%;
        order: 1;
    }
    .section-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

.top-callout-text {
  font-size: 28px;
}

.theme--light .light-purple {
  color: black;
}
.light-purple {
  color: rgb(213, 178, 213);
}

h2 {
  font-family: 'Fira Sans', sans-serif;
}

.svg-sparkle-contain {
  margin-bottom: 1px;
  margin-right: 2px;
  margin-left: 2px;
}

.header__cta-button-group {
  display: flex;
  column-gap: 20px;
}

.header__cta-button-group .v-btn {
  flex-grow: 1;
}

.top-callout-banner {
  text-align: center;
  background-color: #3A2C42;
  padding: 18px 12px;
  font-weight: normal;
  font-size: 14px;

  background: linear-gradient(90deg, #4E4273 25%, #6A5690 50%, #4E4273 75%);
  background-size: 200% 100%;
  animation: shimmer 1s 1 forwards linear; /* Run once and keep final state */
}

.top-callout-banner p {
  margin: 0;
  margin-bottom: 0;
}

@keyframes shimmer {
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 140%;
  }
}
</style>
