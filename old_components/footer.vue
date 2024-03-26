<template>
  <footer class="footer__light">
    <div class="footer-content">
      <NuxtLink to="/">
        <img :src="$vuetify.theme.dark ? '/img/logo-wordmark-dark.svg' : '/img/logo-wordmark.svg'" alt="">
      </NuxtLink>
      <div class="social-icons">
        <v-btn
          href="https://www.instagram.com/sourcery_app/"
          icon
          x-large
          color="primary"
        >
          <v-icon color="primary" large>
            mdi-instagram
          </v-icon>
        </v-btn>
        <v-btn
          href="https://www.facebook.com/SourceryApp"
          icon
          x-large
          color="primary"
        >
          <v-icon color="primary" large>
            mdi-facebook
          </v-icon>
        </v-btn>
        <v-btn
          href="https://twitter.com/Sourcery_App"
          icon
          x-large
          color="primary"
        >
          <v-icon color="primary" large>
            mdi-twitter
          </v-icon>
        </v-btn>
      </div>
      <p v-if="text" class="mt-3">
        Sourcery is a project of the Corporation for Digital
        Scholarship, a nonprofit organization dedicated to the
        development of software and services for researchers and
        cultural heritage institutions, in partnership with
        Greenhouse Studios | Scholarly Communications Design at
        UConn
      </p>
    </div>
  </footer>
</template>

<script>
export default {
    name: 'Footer',
    props: {
        text: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data () {
        return {
        }
    }
}
</script>

<style scoped>
footer {
    width: 100%;
    background: hsla(260, 75%, 75%, 0.05);
}
.footer-content {
    padding: 24px 24px;
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    line-height: 22px;
}
.footer-content img {
    fill: red;
    width: 100%;
    height: 40px;
}
.social-icons {
    display: flex;
    justify-content: center;
}
.social-icons .social-icon {
    transition: transform 100ms ease-in;
    margin-left: 8px;
    margin-right: 8px;
}
.social-icons .social-icon:hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
.social-icons .social-icon img {
    height: 32px;
    width: 32px;
}
</style>
