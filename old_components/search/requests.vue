<template>
  <div class="search-requests">
    <v-text-field
      v-model="filter.text"
      class="request-search-input mb-2"
      outlined
      clearable
      prepend-inner-icon="mdi-magnify"
      placeholder="Search Requests"
      hide-details
      :rounded="false"
    />

    <v-row justify="end">
      <v-col class="text-right">
        <v-menu
          v-model="filterOpen"
          :close-on-content-click="false"
          offset-y
          left
          bottom
        >
          <template #activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
              Filter/Sort By
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-text>
              <span class="text-uppercase">Status</span>
              <v-checkbox
                v-for="status in statuses"
                v-model="filter.status"
                :label="status.name"
                color="#644ea2"
                :value="status.id"
                hide-details
              />
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-chip v-for="s in filterBadges" class="ma-2" close @click:close="removeStatusFromFilter(s.id)">
          {{ s.name }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col>
        <p>Loading...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredRequests.length > 0">
      <v-col v-for="request in filteredRequests" cols="12" md="6">
        <request-listing :request="request" :client="isClientView" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <p>No requests for the current filter.</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Request } from '~/models/Request'
import { Status } from '~/models/Status'

export default {
    props: {
        type: {
            type: String,
            default: 'researcher'
        }
    },
    data () {
        return {
            filterOpen: false,
            requests: [],
            filter: {
                status: [],
                text: ''
            },
            statuses: [],
            loading: true
        }
    },
    async fetch () {
        console.log('doing fetch')
        if (this.$route.query.status) {
            this.filter.status = this.$route.query.status.split(',').map(x => parseInt(x))
        }
        this.statuses = await Status.getAll()
        await this.fetchRequests()
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
        isClientView () {
            return this.type === 'researcher'
        },
        filterBadges () {
            return this.statuses.filter(x => this.filter.status.includes(x.id))
        },
        filteredRequests () {
            let requests = Array.from(this.requests)

            if (this.filter.text) {
                requests = requests.filter((x) => {
                    return x.citation.toLowerCase().includes(this.filter.text.toLowerCase()) || x.request_vendor?.label.toLowerCase().includes(this.filter.text.toLowerCase())
                })
            }

            if (this.filter.status.length > 0) {
                requests = requests.filter((x) => {
                    return this.filter.status.includes(x.status_id)
                })
            }

            return requests
        },
        filterStatusNames () {
            return this.statuses.filter(x => this.filter.status.includes(x.id)).map(x => x.name)
        }
    },
    methods: {
        ...mapActions({
            syncUsers: 'supabaseUserCache/sync_users'
        }),
        clearFilter () {
            this.filter = {
                status: [],
                text: ''
            }
        },
        viewRequest (request) {
            this.$router.push(`/request/${request.id}`)
        },
        removeStatusFromFilter (id) {
            const spliceIndex = this.filter.status.findIndex((val) => {
                return val === id
            })
            if (spliceIndex > -1) {
                this.filter.status.splice(spliceIndex, 1)
                this.fetchRequests(true)
            }
        },
        clearRequests () {
            this.requests = []
        },
        async fetchRequests (replaceRequests = false) {
            this.loading = true
            const offset = replaceRequests ? 0 : this.requests.length
            let new_requests = []
            if (this.type === 'researcher') {
                new_requests = await Request.getForCreator(this.authUser.id, this.filterStatusNames, offset)
            } else if (this.type === 'organization') {
                new_requests = await Request.getForRepositories(this.userRepositories, this.filterStatusNames, offset)
            }

            // Get all request owner ids for these new requests so we can fetch user data
            const new_user_ids = new_requests.map(x => x.user_id).filter((val, index, arr) => {
                return arr.indexOf(val) === index
            })
            await this.syncUsers(new_user_ids)

            if (replaceRequests) {
                this.requests = new_requests
            } else {
                this.requests.push(...new_requests)
            }

            this.loading = false
            return true
        }
    }
}
</script>

<style scoped>
.request-search-input {
  font-size: 24px;
}
</style>

<style>
.request-search-input input {
  padding-left: 20px;
}
</style>
