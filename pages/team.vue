<template>
  <div class="page-container">
    <div id="content-wrap" class="px-4">
      <sourcery-header class="mx-n4" text="Meet the Team" />
      <!-- <v-app-bar
        :color="$vuetify.theme.dark ? '#121212' : 'white'"
        height="84px"
        elevate-on-scroll
        app
      >
        <v-layout>
          <v-spacer />
          <v-app-bar-title>
            <NuxtLink id="wordmark-link" to="/">
              <img id="logo" :src="$vuetify.theme.dark ? '/img/sourcery-wordmark-dark.svg' : '/img/sourcery-wordmark.svg'" alt="Sourcery Logo">
            </NuxtLink>
          </v-app-bar-title>
          <v-spacer />
        </v-layout>
      </v-app-bar> -->
      <v-layout>
        <v-flex xs12 sm6 xl4 offset-sm3 offset-xl4>
          <h1 class="text-center my-24 text-h2 font-weight-medium">
            Meet the Team
          </h1>
          <!-- <h1 class="my-12">
            Current Members
          </h1> -->
          <div
            v-for="member in members.sort((a, b) => (a.name.split(' ').pop() > b.name.split(' ').pop()) ? 1 : -1)"
            :key="member.name"
          >
            <v-card

              color="transparent"
              flat
              class="mb-12"
            >
              <v-row class="align-center">
                <v-col class="flex-grow-0">
                  <v-img
                    :src="'/img/team/' + member.name.split(' ').pop() + '.jpg'"
                    lazy-src="/img/team/g_icon-placeholder.jpg"
                    height="188"
                    width="152"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col class="flex-grow-1">
                  <v-list-item two-line class="pl-2">
                    <v-list-item-content class="pt-0">
                      <v-list-item-title style="font-size:1.8rem">
                        {{ member.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-h6 mt-1">
                        <em>{{ member.title }}</em>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <p class="mt-1 pl-2 mb-0 text--primary">
                    {{ member.bio }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
            <v-divider class="mb-12" />
          </div>
          <h1 class="mb-12">
            Alumni
          </h1>
          <div class="d-flex flex-wrap mx-sm-n12 justify-center justify-sm-space-between">
            <v-card
              v-for="member in alumni.sort((a, b) => (a.name.split(' ').pop() > b.name.split(' ').pop()) ? 1 : -1)"
              :key="member.name"
              color="transparent"
              flat
              class="mb-8 flex-shrink-1 mx-sm-8 pa-3"
              width="176"
            >
              <v-img
                :src="'/img/team/' + member.name.split(' ').pop() + '.jpg'"
                lazy-src="/img/team/g_icon-placeholder.jpg"
                height="188"
                width="152"
                class="rounded"
              />
              <v-list-item two-line class="pl-0 pt-0">
                <v-list-item-content>
                  <v-list-item-title class="text-h5 text-wrap">
                    {{ member.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    {{ member.title }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            <!-- <v-row no-gutters>
              <v-col :order="index % 2" class="pa-3 flex-grow-0">
                <v-img
                  :src="'/img/team/' + member.name.split(' ').pop() + '.jpg'"
                  lazy-src="/img/team/g_icon-placeholder.jpg"
                  height="188"
                  width="152"
                  class="rounded-sm"
                />
              </v-col>
              <v-col class="flex-grow-1">
                <v-list-item two-line :class="index % 2 == 0 ? 'pl-0' : ''">
                  <v-list-item-content>
                    <v-list-item-title class="text-h5">
                      {{ member.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ member.title }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row> -->
            </v-card>
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
    name: 'Team',
    components: {
        'sourcery-footer': Footer,
        'sourcery-header': Header
    },
    layout: 'landing-beta',
    middleware: null,
    data () {
        return {
            members: [
                {
                    name: 'Brian Daley',
                    title: 'Co-PI/Lead Developer',
                    bio: 'For nearly 20 years, Brian has been creating for web and mobile platforms as a freelancer and a web developer with University Communications at the University of Connecticut. His work includes projects like the UConn homepage and UConn Health, as well as many other high-profile digital marketing campaigns and websites.'
                },
                {
                    name: 'Brooke Foti Gemmell',
                    title: 'Lead Designer',
                    bio: 'Brooke Foti Gemmell is a Design Technologist at Greenhouse Studios, an interdisciplinary research unit which aims to reframe the workflows of collaborative scholarly production. With a background in visual arts and design, Brooke is a creative producer and visual problem solver on Greenhouse Studios projects, and also works on the branding and outreach of Greenhouse Studios at large. She holds a B.F.A in Studio Arts and is an M.A. candidate in Digital Media & Design at the University of Connecticut. Her areas of specialty include communications design, branding, photography, and book arts.'
                },
                {
                    name: 'Samson Weiner',
                    title: 'Developer',
                    bio: 'Samson joined the Sourcery team in the Fall of 2018 while an undergraduate. He is continuing his studies as a graduate student at the University of Connecticut studying computer science. His main area of research involves applying algorithms to evolutionary and biological problems, though his interests extend to computational theory as a whole. Outside of research and Sourcery, Samson enjoys exploring new media outlets and technology. His favorite quarantine activities have been cooking, reading, and art.'
                },
                {
                    name: 'Alex Mueller',
                    title: 'UX Designer & Developer',
                    bio: 'Alex Mueller is a senior studying Digital Media and Design with a concentration in Web and Interactive Media. He has loved doing design work as a hobby for the past 5 years and is looking forward to pursuing design as a career. He also has been interested in programming since he was a child and likes to combine both his design and development skills wherever he can. Outside of school, he enjoys playing the drums and photography.'
                },
                {
                    name: 'Greg Colati',
                    title: 'Co-I/Senior Strategist',
                    bio: 'Greg Colati is the Director of the Digital Preservation Repository Program at UConn, as well as the head of the Connecticut Digital Archive, a statewide preservation-oriented digital repository service for libraries, archives, museums, and memory institutions. Mr. Colati has more than 25 years  experience in archives and cultural heritage institutions. He is currently an adjunct Professor UConn’s department of Digital Media and Design and has taught courses in archives management and digital repositories at Simmons University GSLIS, the University of Denver and for the Society of American Archivists.'
                },
                {
                    name: 'Wes Hamrick',
                    title: 'Business Manager',
                    bio: 'Wes Hamrick is a postdoctoral fellow at Greenhouse Studios at the University of Connecticut, where he serves as project manager on a number of digital humanities projects, including an AR (augmented reality) experience, the document delivery app Sourcery, and a digital game for learning Early Modern Irish. He specialises in British and Irish literature of the long eighteenth century.'
                },
                {
                    name: 'Garrett McComas',
                    title: 'Outreach Coordinator',
                    bio: 'Garrett McComas has a MLIS from University of Illinois at Urbana-Champaign and began working at Greenhouse Studios in 2020. He enjoys creating sustainable digital humanities projects with researchers and libraries. As a part of the Sourcery team, he leverages his background as a researcher and his experiences working with libraries and archives to work on Community Outreach for the project.'
                },
                {
                    name: 'Sara Sikes',
                    title: 'Co-I/Senior Strategist',
                    bio: 'Sara Sikes, MA, is the Associate Director of Greenhouse Studios. She joined the Library staff at the University of Connecticut in 2016, and her career includes positions in museums, academic publishing, public history institutions and research libraries.'
                },
                {
                    name: 'Tom Scheinfeldt',
                    title: 'PI/Project Director',
                    bio: 'Tom Scheinfeldt is Associate Professor of Digital Humanities at the University of Connecticut where he holds a joint appointment in the Department of Digital Media & Design and the Department of History. He is also Director of Greenhouse Studios (greenhousestudios.uconn.edu), a transdisciplinary research unit that solves the problems and explores the opportunities of scholarship in the "digital age." Formerly Managing Director of the Roy Rosenzweig Center for History and New Media at George Mason University, Tom has directed several award-winning digital humanities and academic software projects, including Omeka, THATCamp, and the September 11 Digital Archive. You can follow Tom on Twitter at @foundhistory.'
                },
                {
                    name: 'Brian Kelleher',
                    title: 'Developer',
                    bio: 'Prior to working for the Digital Experience Group, Brian worked as a web developer for University Communications at UConn, where he created and managed WordPress websites such as the premier news website UConn Today.  Brian was also the principle web developer for a live-streaming video startup where he created web and native mobile applications, and worked extensively with emerging cloud technology.'
                }
            ],
            alumni: [
                {
                    name: 'Lauren Ciulla',
                    title: 'Design Intern'
                },
                {
                    name: 'Emmet de Barra',
                    title: 'Graduate Assistant'
                },
                {
                    name: 'Eri Lauer',
                    title: 'Design Intern'
                },
                {
                    name: 'Shunyi Li',
                    title: 'Social Media Assistant'
                },
                {
                    name: 'Elijah Matthews',
                    title: 'Design Intern'
                },
                {
                    name: 'Tim Morris',
                    title: 'Developer'
                },
                {
                    name: 'Lily Pashapour',
                    title: 'Design Intern'
                },
                {
                    name: 'Sophia Valentin',
                    title: 'Social Media Assistant'
                },
                {
                    name: 'Wenchao Lou',
                    title: 'UI/UX Designer',
                    bio: 'Wenchao Lou is a Digital Media & Design major student at the University of Connecticut. Within the Digital Media & Design program, she concentrates in Game Design. She has experience in video production, web design, UI/UX design and game design.'
                }
            ]
        }
    },
    mounted () {},
    methods: {
    },
    head () {
        return {

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
</style>