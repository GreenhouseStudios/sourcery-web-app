<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-4">
        History
      </h1>
      <sourcery-card title="Your Archived Requests" icon="mdi-archive">
        <none-found-card v-if="requests.length == 0" text="No past requests found." to="/request/create">
          Create<span class="hidden-sm-and-down">&nbsp;Request</span>
          <v-icon right :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
            mdi-open-in-new
          </v-icon>
        </none-found-card>
        <v-list two-line color="transparent">
          <request-listing v-for="(request) in requests" :request="request" :client="true" />
        </v-list>
      </sourcery-card>

      <sourcery-card v-if="userRepositories.length > 0" title="Organization Completed Requests" icon="mdi-archive">
        <none-found-card v-if="jobs.length == 0" text="No past requests found." />
        <request-listing v-for="job in jobs" :request="job" :client="false" />
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import NoneFoundCard from '@/components/none-found-card.vue'
import SourceryCard from '@/components/card-with-header.vue'
import RequestListing from '@/components/request-listing.vue'
import { Request } from '~/models/Request'

export default {
    name: 'History',
    components: {
        'sourcery-card': SourceryCard,
        'none-found-card': NoneFoundCard,
        RequestListing
    },
    async asyncData ({ store }) {
        const logged_in = store.getters['supabaseAuth/authUser'] && store.getters['supabaseAuth/authUser'].id
        let requests = []
        let jobs = []

        if (logged_in) {
            const uid = store.getters['supabaseAuth/authUser'].id
            requests = await Request.getForCreator(uid, ['Archived', 'Cancelled'])
        }

        if (store.getters['supabaseAuth/ownsAnOrganization']) {
            const user_repositories = store.getters['supabaseAuth/userRepositories']
            jobs = await Request.getForRepositories(user_repositories, ['Archived', 'Cancelled'])
        }

        return {
            requests,
            jobs
        }
    },
    data () {
        return {
            requests: [],
            jobs: []
        }
    },
    computed: {
        ...mapGetters({
            userRepositories: 'supabaseAuth/userRepositories'
        })
    }
}
</script>

<style scoped>
</style>
