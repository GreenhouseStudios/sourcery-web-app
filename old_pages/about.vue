<template>
  <div class="page-container">
    <div id="content-wrap" class="mb-8">
      <sourcery-header class="mx-n4" />
      <div class="page-content">
        <img src="~/assets/sourcery-tubes.png" class="accent-image">
        <h1 class="font-size-48 about-header mb-7">
          About Sourcery
        </h1>
        <p>Sourcery—an open source, not-for-profit, web-based application for providing remote access to archival documents—aims to improve how researchers request document scans from archivists and how archivists fulfill those requests.</p>
        <h2 class="barlow-header mb-2">
          For Repositories &amp; Archivists
        </h2>
        <p>For archivists, Sourcery provides archivists a streamlined, cross-platform (mobile, tablet, or laptop) reference scanning workflow, including tools to: help clarify, categorize, staff, and track outstanding requests; manage researcher communication; set and easily collect fees (for institutions that charge for these services); assess the true costs of their labor; and report these costs to decision makers in advocating for additional resources and staff.</p>
        <!-- <button-large
          v-if="$vuetify.breakpoint.smAndDown"
          class="mb-4 pr-8"
          text="Become a Sourcery Partner"
          right-gradient="#B86FD1"
          left-gradient="#31167A"
          to="/join-us"
          :block="false"
        /> -->
        <h2 class="barlow-header mb-2">
          For Researchers &amp; Requesters
        </h2>
        <p>For researchers, Sourcery aims to provide a single, simple interface for requesting remote access to not-yet digitized documents at repositories around the world. With Sourcery on a phone or laptop, a researcher seeking a document can simply enter the document's location and citation information and receive a scan directly from within the app. It aims to provide better tools for communicating with archivists, provide easier payment options, allow for tracking requests placed at multiple archives within a single interface, and integrate with popular research tools like Zotero and Tropy.</p>
        <br>
        <p>Existing means of providing remote access to non-digitized sources create confusion for researchers and extra work for already stretched archivists. Sourcery aims to remedy these problems, creating new and more efficient pathways of computer-mediated research and systems to facilitate and properly account for and fund the often unaccounted and under-resourced labor of archivists in providing reference scans. At the same time, Sourcery recognizes that much archival research depends on close contact between researchers and archivists. By providing more effective online access, Sourcery ultimately aims to free up both researchers and archivists to focus on the sustained, mutual journeys of intellectual discovery at the heart of archival research.</p>
        <!-- <button-large
          v-if="$vuetify.breakpoint.smAndDown"
          class="mb-4 pr-8"
          text="Request with Sourcery"
          right-gradient="#DD4A8B"
          left-gradient="#B86FD1"
          to="/login"
          :block="false"
        /> -->
        <!-- <v-row v-if="$vuetify.breakpoint.mdAndUp" class="pr-8">
          <v-col>
            <button-large text="Become a Sourcery Partner" right-gradient="#B86FD1" left-gradient="#31167A" to="/join-us" />
          </v-col>
          <v-col>
            <button-large text="Request with Sourcery" right-gradient="#DD4A8B" left-gradient="#B86FD1" to="/login" />
          </v-col>
        </v-row> -->
      </div>
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
    name: 'About',
    components: {
        'sourcery-footer': Footer,
        'sourcery-header': Header
    },
    layout: 'landing-beta',
    middleware: null,
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

.about-header {
  font-family: 'Fira Sans', 'sans-serif';
}

.theme--light .about-header,
.theme--light .barlow-header {
  color: #654EA3;
}

.font-size-48 {
  font-size: 48px;
  font-family: 'Fira Sans', sans-serif;
}

.barlow-header {
  font-size: 30px;
  font-family: 'Barlow', sans-serif;
}

.page-content {
  padding-top: 4em;
  padding-left: 4em;
}

.page-content p {
  margin-bottom: 24px;
  padding-right: 2em;
}

.accent-image {
  float: right;
  display: inline;
  max-width: 40%;
}

@media (max-width: 800px) {
  .page-content {
    padding-left: 2em;
  }
  .accent-image {
    max-width: 25%;
  }
}
</style>
