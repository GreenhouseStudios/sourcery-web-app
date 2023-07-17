<template>
  <v-layout>
    <v-flex
      xs12
      sm10
      offset-sm1
    >
      <h1 class="mb-4">
        {{ pageTitle }}
      </h1>

      <logged-out-card />
      <org-stat-bar
        v-if="isOrgMember"
        :new-count="newJobs.length"
        :progress-count="inProgressJobs.length"
        :completed-count="completedAndArchivedJobs.length"
        :turnaround-text="averageTimeText"
      />

      <v-row v-if="isOrgMember">
        <v-col cols="12" lg="6">
          <card-with-action title="Pending" :number-requests="newJobs.length" action="/requests?status=1&o=1">
            <request-listing v-for="job in newJobsLimited" :key="`njl-${job.id}`" :request="job" :client="false" />
            <span v-if="newJobs.length === 0">Out looking for toadstools.<br>No new requests.</span>
          </card-with-action>
          <card-with-action v-if="!$vuetify.breakpoint.mobile" title="Completed" :number-requests="completedJobs.length" action="/requests?status=3,4&o=1">
            <request-listing v-for="job in completedJobsLimited" :key="`cjl-${job.id}`" :number-requests="completedJobs.length" :request="job" :client="false" />
            <span v-if="completedJobs.length === 0">No recently completed requests.</span>
          </card-with-action>
        </v-col>
        <v-col cols="12" lg="6">
          <card-with-action title="In - Progress" :number-requests="inProgressJobs.length" action="/requests?status=2&o=1">
            <request-listing v-for="job in inProgressJobsLimited" :key="`ipjl-${job.id}`" :request="job" :client="false" />
            <span v-if="inProgressJobs.length === 0">All spells have been cast!<br>No requests in-progress.</span>
          </card-with-action>
          <card-with-action v-if="$vuetify.breakpoint.mobile" title="Completed" :number-requests="completedJobs.length" action="/requests?status=3,4&o=1">
            <request-listing v-for="job in completedJobsLimited" :key="`cjl-${job.id}`" :number-requests="completedJobs.length" :request="job" :client="false" />
            <span v-if="completedJobs.length === 0">No recently completed requests.</span>
          </card-with-action>
          <button-large :to="`/settings/feedback`" :text="`Report a Bug`" />
        </v-col>
      </v-row>

      <!-- <sourcery-card v-if="user && isOrgMember" title="Requests Needing Service" class="mt-8" icon="mdi-briefcase">
        <none-found-card v-if="jobs.length == 0" text="This organization has no outstanding requests that need service." />

        <request-listing v-for="job in jobs" :key="`jl-${job.id}`" :request="job" :client="false" />
      </sourcery-card> -->

      <h1 v-if="requests.length > 0 && isOrgMember" class="mb-4">
        Personal Requests
      </h1>

      <v-alert
        v-if="prospectiveRequestCount > 0"
        border="left"
        class="mt-4"
      >
        You have {{ prospectiveRequestCount }} requests with unregistered organizations.  You can view <nuxt-link to="/request/unregistered">
          those here.
        </nuxt-link>
      </v-alert>

      <user-stat-bar
        :new-count="newRequests.length"
        :progress-count="inProgressRequests.length"
        :completed-count="completedAndArchivedRequests.length"
      />

      <v-row>
        <v-col cols="12" lg="6">
          <card-with-action title="Pending" :number-requests="newRequests.length" action="/requests?status=1">
            <request-listing v-for="request in newRequestsLimited" :key="`njl-${request.id}`" :request="request" :client="true" />
            <span v-if="newRequests.length === 0">No new requests.</span>
          </card-with-action>
          <card-with-action v-if="!$vuetify.breakpoint.mobile" title="Completed" :number-requests="completedRequests.length" action="/requests?status=3,4">
            <request-listing v-for="request in completedRequestsLimited" :key="`cjl-${request.id}`" :number-requests="completedRequests.length" :request="request" :client="true" />
            <span v-if="completedRequests.length === 0">No recently completed requests.</span>
          </card-with-action>
        </v-col>
        <v-col cols="12" lg="6">
          <card-with-action title="In - Progress" :number-requests="inProgressRequests.length" action="/requests?status=2">
            <request-listing v-for="request in inProgressRequestsLimited" :key="`ipjl-${request.id}`" :request="request" :client="true" />
            <span v-if="inProgressRequests.length === 0">No requests in-progress.</span>
          </card-with-action>
          <card-with-action v-if="$vuetify.breakpoint.mobile" title="Completed" :number-requests="completedRequests.length" action="/requests?status=3,4">
            <request-listing v-for="request in completedRequestsLimited" :key="`cjl-${request.id}`" :number-requests="completedRequests.length" :request="request" :client="true" />
            <span v-if="completedRequests.length === 0">No recently completed requests.</span>
          </card-with-action>
          <button-large :to="`/settings/feedback`" :text="`Report a Bug`" />
        </v-col>
      </v-row>

      <v-row v-if="requests.length === 0" class="mt-2">
        <v-col>
          <p>
            No requests yet.  <nuxt-link to="/request/create">
              Let's make one!
            </nuxt-link>
          </p>
        </v-col>
      </v-row>

      <!-- <sourcery-card v-if="user" title="Requests You Created" icon="mdi-file-search" class="mt-8">
        <none-found-card v-if="requests.length == 0" text="You have no active requests." to="/request/create">
          Create<span class="hidden-sm-and-down">&nbsp;Request</span>
          <v-icon right :class="$vuetify.theme.dark ? 'black--text' : 'white--text'">
            mdi-open-in-new
          </v-icon>
        </none-found-card>

        <request-listing v-for="(request) in requests" :key="`rl-${request.id}`" :request="request" :client="true" />
      </sourcery-card> -->
      <view-history-button v-if="user" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
// import NoneFoundCard from '@/components/none-found-card.vue'
// import SourceryCard from '@/components/card-with-header.vue'
import CardWithAction from '@/components/card-with-action.vue'
import LoggedOutCard from '@/components/logged-out-card.vue'
import ViewHistoryButton from '@/components/view-history-button.vue'
import RequestListing from '@/components/request-listing.vue'
import OrgStatBar from '@/components/org-stat-bar.vue'
import UserStatBar from '@/components/user-stat-bar.vue'
import ButtonLarge from '@/components/button-large.vue'
import { Request } from '~/models/Request'
import { Organization } from '~/models/Organization'

export default {
    name: 'Dashboard',
    components: {
        // SourceryCard,
        // NoneFoundCard,
        LoggedOutCard,
        ViewHistoryButton,
        RequestListing,
        OrgStatBar,
        UserStatBar,
        CardWithAction,
        ButtonLarge
    },
    async asyncData ({ params, store, app }) {
        const logged_in = store.getters['supabaseAuth/authUser'] && store.getters['supabaseAuth/authUser'].id
        let requests = []
        let jobs = []
        let avgTimeMeta
        if (logged_in) {
            const uid = store.getters['supabaseAuth/authUser'].id
            requests = await Request.getForCreator(uid, ['In Progress', 'Submitted', 'Complete'])
            await store.dispatch('supabaseProspective/countForUser')
        }

        if (store.getters['supabaseAuth/ownsAnOrganization']) {
            const user_repositories = store.getters['supabaseAuth/userRepositories']
            jobs = await Request.getForRepositories(user_repositories, ['In Progress', 'Submitted', 'Complete', 'Archived'])
            avgTimeMeta = await Organization.getAverageTurnaroundTime(store.getters['supabaseAuth/userOrganizationIds'][0])
        }
        return {
            requests,
            jobs,
            organizations: [],
            avgTimeMeta
        }
    },
    data () {
        return {
            requests: [],
            jobs: [],
            organizations: [],
            limit: 4,
            avgTimeMeta: null
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            isOrgMember: 'supabaseAuth/ownsAnOrganization',
            prospectiveRequestCount: 'supabaseProspective/requestCount'
        }),
        pageTitle () {
            if (this.isOrgMember) {
                return 'Institutional Dashboard'
            }
            return 'Dashboard'
        },
        isResearcher () {
            if (this.isOrgMember) {
                return false
            }
            return true
        },
        newJobs () {
            return this.jobs.filter(x => x.status?.name === 'Submitted')
        },
        newRequests () {
            return this.requests.filter(x => x.status?.name === 'Submitted')
        },
        inProgressJobs () {
            return this.jobs.filter(x => x.status?.name === 'In Progress')
        },
        inProgressRequests () {
            return this.requests.filter(x => x.status?.name === 'In Progress')
        },
        completedJobs () {
            return this.jobs.filter(x => x.status?.name === 'Complete')
        },
        completedRequests () {
            return this.requests.filter(x => x.status?.name === 'Complete')
        },
        completedAndArchivedJobs () {
            return this.jobs.filter(x => x.status?.name === 'Complete' || x.status?.name === 'Archived')
        },
        completedAndArchivedRequests () {
            return this.requests.filter(x => x.status?.name === 'Complete' || x.status?.name === 'Archived')
        },
        newJobsLimited () {
            return this.newJobs.slice(0, this.limit)
        },
        newRequestsLimited () {
            return this.newRequests.slice(0, this.limit)
        },
        inProgressJobsLimited () {
            return this.inProgressJobs.slice(0, this.limit)
        },
        inProgressRequestsLimited () {
            return this.inProgressRequests.slice(0, this.limit)
        },
        completedJobsLimited () {
            return this.completedJobs.slice(0, this.limit)
        },
        completedRequestsLimited () {
            return this.completedRequests.slice(0, this.limit)
        },
        averageTimeText () {
            const day = 86400
            const hour = 3600
            const minute = 60

            const totalseconds = this.avgTimeMeta ? Math.trunc(this.avgTimeMeta.averagetime) : 0

            const daysout = Math.floor(totalseconds / day)
            const hoursout = Math.floor((totalseconds - daysout * day) / hour)
            const minutesout = Math.floor((totalseconds - daysout * day - hoursout * hour) / minute)
            const secondsout = totalseconds - daysout * day - hoursout * hour - minutesout * minute

            if (totalseconds === 0) {
                return 'N/A'
            }

            if (daysout > 0) {
                let d = 'day'
                if (daysout > 1) {
                    d += 's'
                }
                return `${daysout} ${d}`
            }

            if (hoursout > 0) {
                let h = 'hour'
                if (hoursout > 1) {
                    h += 's'
                }
                return `${hoursout} ${h}`
            }

            if (minutesout > 0) {
                return `${minutesout} min`
            }

            return `${secondsout} sec`
        }
    }
}
</script>

<style scoped>
.institutional-job {
    border: 1px solid var(--v-primary-base);
    padding: 1em
}
</style>
