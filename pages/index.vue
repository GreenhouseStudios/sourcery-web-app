<template>
    <div id="page-home">
        <div class="bg-purple-gradient padded-section px-6 px-sm-0 text-white" v-intersect="onIntersect">
            <v-container>
                <v-row align="center" justify="center">
                    <v-col cols="auto" class="me-10">
                        <v-img class="header__logo" src="/img/logo-wordmark-white.svg" :width="510" alt=""></v-img>
                        <div class="header__slogan">
                            <p class="text-uppercase d-md-flex align-center font-weight-light">
                                <span class="me-1">Open source</span>
                                <IconsSvgSparkle height="12" class="ma-1" />
                                <span class="ma-1">Not for profit</span>
                                <IconsSvgSparkle height="12" class="ma-1" />
                                <span class="ma-1">Community Driven</span>
                            </p>
                        </div>
                        <p class="my-6 header__callout">
                            Remote access to archival documents.
                        </p>
                        <div class="header__cta-button-group d-flex">
                            <v-btn variant="outlined" size="x-large" @click="showDialog" class="me-6 flex-grow-1">
                                Register
                            </v-btn>
                            <v-btn variant="outlined" size="x-large" to="/login" class="flex-grow-1">
                                Login
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="auto">
                        <v-img class="header__mockup d-none d-md-block" src="~/assets/doublephone-sourcery-02-compressed.png" alt="" :width="330"></v-img>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <v-container class="padded-section">
            <h1 id="meet" class="mb-9 text-center">How Sourcery Can Work for Your Institution</h1>

            <v-row align="center" justify="center" class="mb-5 px-6">
                <v-col md="2" cols="12" class="text-center">
                    <IconsSvgOptimize />
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="text-primary">
                    Optimize your Research Requests Workflow
                    </h2>
                    <p>Manage requests for document scans and other researcher requests from a simple, intuitive dashboard. Fulfill requests on any device connected to the internet with the device's camera or by uploading a pdf, jpg, png, or other file.</p>
                </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mb-5 px-6">
                <v-col md="2" cols="12" class="text-center">
                    <IconsSvgCommunicate />
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="text-primary">
                    Communicate Directly
                    </h2>
                    <p>Ask and answer questions, make clarifications, and more through the in-app, per-request message feature. Declutter your inbox and streamline correspondance right in the app.</p>
                </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mb-5 px-6">
                <v-col md="2" cols="12" class="text-center">
                    <IconsSvgAnalytics />
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="text-primary">
                    Access Rich Usage Analytics
                    </h2>
                    <p>See your institution's average turnaround time, most common file type requests, geographical areas of requests, new and repeat requesters, average file size, and more from the Institutional Analytics feature.</p>
                </v-col>
            </v-row>
        </v-container>

        <div class="bg-purple-opacity">
            <v-container class="padded-section">
                <v-row align="center" class="mb-8 px-6" justify="center">
                    <v-col cols="auto">
                        <v-img class="section-img" :width="400" src="/img/landing-illustrations/undraw_faq_rjoy.svg" alt=""></v-img>
                    </v-col>
                    <v-col class="order-sm-first me-5" cols="auto">
                        <h1 id="how" class="d-inline-block">How does Sourcery work?</h1>
                    </v-col>
                </v-row>

                <v-row class="px-6">
                    <v-col md="10" offset-md="1">
                        <p>The Sourcery app allows researchers to request documents directly from our affiliated institutions through a single login and interface, accessible from any device. It aims to streamline the process for both researchers and repositories, offering a simple request and fulfillment workflow and a seamless, secure payments system.</p>

                        <div class="text-center d-flex align-center justify-center my-4">
                            <v-img src="/img/sparkle-circle.svg" :height="40" class="sparkle" :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"></v-img>
                        </div>

                        <p>Sourcery is a not-for-profit service that gives researchers access to documents that can't be found online. During the beta period, users can request documents from select institutions. Just provide the document's citation information, and Sourcery will do the rest.</p>

                        <div class="text-center d-flex align-center justify-center my-4">
                            <v-img src="/img/sparkle-circle.svg" :height="40" class="sparkle" :style="$vuetify.theme.dark ? 'filter: invert(1) hue-rotate(180deg)' : ''"></v-img>
                        </div>

                        <p class="text indiv">Sourcery emerges from the design process of <a href="https://greenhousestudios.uconn.edu/" class="partnerlink">Greenhouse Studios</a> and from the project team's past work and ongoing interests in research software for the humanities. Greenhouse Studios, an incubator for digital scholarship at the University of Connecticut, is a shared initiative of the <a href="https://lib.uconn.edu/" class="partnerlink">UConn Library</a>, <a href="https://sfa.uconn.edu/" class="partnerlink">School of Fine Arts</a>, and the <a href="https://clas.uconn.edu/" class="partnerlink">College of Liberal Arts and Sciences</a>. Sourcery is a project of the <a href="https://digitalscholar.org/" class="partnerlink">Corporation for Digital Scholarship</a>, a not-for-profit organization.</p>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <v-container class="padded-section">
            <v-row align="center" justify="center" class="px-6">
                <v-col cols="auto" class="px-5">
                    <v-img src="/img/landing-illustrations/undraw_enter_uhqk.svg" alt="" :width="280"></v-img>
                </v-col>
                <v-col class="order-sm-first me-10" cols="12" sm="6">
                    <h1 id="ready" class="mb-7">Ready to try Sourcery?</h1>
                    <v-row class="mb-6">
                        <v-col>
                            <v-btn color="primary" size="x-large" height="76px" block @click="showDialog">Register</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn to="/login" color="primary" size="x-large" height="76px" block variant="outlined">Log In</v-btn>
                        </v-col>
                    </v-row>
                    <v-btn to="/about" variant="text" block>Learn More</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="dialogVisible" max-width="650">
            <v-card id="modal-card" title="Ready to try Sourcery?">
                <template v-slot:append>
                    <v-btn rounded="md" @click="dialogVisible = false" icon="mdi-close"></v-btn>
                </template>
                <v-card-text>
                    <v-container>
                        <v-row align="stretch">
                            <v-col cols="6">
                                <NuxtLink
                                    to="/register"
                                    class="bg-primary d-block text-center text-decoration-none"
                                    style="height: 280px;"
                                >
                                    <div class="fill-height d-flex flex-column justify-center">
                                        <v-img src="/img/icons_document.png" max-height="140"></v-img>
                                        <span class="text-h6 font-weight-bold mt-4">
                                            Request Documents
                                        </span>
                                    </div>
                                </NuxtLink>
                            </v-col>
                            <v-col cols="6">
                                <NuxtLink
                                    to="/join-us"
                                    class="bg-primary d-block text-center text-decoration-none"
                                    style="height: 280px;"
                                >
                                    <div class="fill-height d-flex flex-column justify-center">
                                        <v-img src="/img/icons_institution.png" max-height="140"></v-img>
                                        <span class="text-h6 font-weight-bold mt-4 px-4">
                                            Become a Partner Institution
                                        </span>
                                    </div>
                                </NuxtLink>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <span>
                                    Have an account?
                                    <NuxtLink to="/login">
                                    Log in.
                                    </NuxtLink>
                                </span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>


        <footer class="padded-section bg-purple-opacity px-6">
            <v-container>
                <v-row align="center" justify="center">
                    <v-col cols="auto">
                        <NuxtLink to="/" class="text-center">
                            <img :width="300" :src="theme.global.current.value.dark ? '/img/logo-wordmark-dark.svg' : '/img/logo-wordmark.svg'" alt="">
                        </NuxtLink>
                    </v-col>
                </v-row>

                <div class="d-flex justify-center align-center my-3">
                    <v-btn href="https://www.instagram.com/sourcery_app/" size="x-large" variant="text" color="primary" icon="mdi-instagram" border="none" class="mx-2"></v-btn>
                    <v-btn href="https://www.facebook.com/SourceryApp" size="x-large" variant="text" color="primary" icon="mdi-facebook" border="none" class="mx-2"></v-btn>
                    <v-btn href="https://twitter.com/Sourcery_App" size="x-large" variant="text" color="primary" icon="mdi-twitter" border="none" class="mx-2"></v-btn>
                </div>

                <p class="text-center">Sourcery is a project of the Corporation for Digital Scholarship, a nonprofit organization dedicated to the development of software and services for researchers and cultural heritage institutions, in partnership with Greenhouse Studios | Scholarly Communications Design at UConn</p>
            </v-container>
        </footer>
    </div>
</template>

<script setup>
import { useTheme } from 'vuetify'

definePageMeta({
    layout: 'public'
})

// Utilize the vuetify theme for light/dark
const theme = useTheme()

// Set a variable for the CTA dialog visibility
const dialogVisible = ref(false)

// Pull in the method to update the header/app bar based on page intersection.
const { setHeaderIntersect } = useHeaderIntersectStore()

// Define a handler for the scroll intersecting content
function onIntersect(isIntersecting, entries, observer) {
    setHeaderIntersect(isIntersecting)
}

function showDialog() {
    dialogVisible.value = true
}
</script>

<style scoped>
.bg-purple-gradient {
    background: #924fbe;
    background: linear-gradient(112deg,#a66dab,#6851a4);
}

.bg-purple-opacity {
    background: rgba(175,143,239,.05);
}

.padded-section {
    padding-top: 5rem;
    padding-bottom: 5rem;
}
.header__slogan {
    font-size: 1.1rem;
}

.header__callout {
    font-size: 1.7rem;
}
</style>