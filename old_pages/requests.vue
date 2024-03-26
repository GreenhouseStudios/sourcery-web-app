<template>
  <v-layout>
    <v-flex xs12 sm10 xl6 offset-sm1 offset-xl3>
      <v-row align="center" justify="space-between" class="mb-3">
        <v-col cols="12" sm="auto">
          <h1>
            {{ title }}
          </h1>
        </v-col>
        <v-col class="mb-3 mb-sm-0" cols="auto">
          <v-btn v-if="hasOrgs" text @click="switchType">
            {{ switchTypeButtonText }}
          </v-btn>
        </v-col>
      </v-row>

      <search-requests ref="requests_search" :type="type" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchRequests from '~/components/search/requests.vue'

export default {
    components: {
        SearchRequests
    },
    data () {
        return {
            manualSwitchType: ''
        }
    },
    computed: {
        ...mapGetters({
            hasOrgs: 'supabaseAuth/ownsAnOrganization'
        }),
        type () {
            if (this.manualSwitchType) {
                return this.manualSwitchType
            }
            if (this.$route.query.o) {
                return 'organization'
            }
            return 'researcher'
        },
        title () {
            if (this.type === 'organization') {
                return 'Organization Requests'
            }
            return 'Personal Requests'
        },
        switchTypeButtonText () {
            let t = 'Switch to '
            if (this.type === 'researcher') {
                t += 'organization requests'
            } else {
                t += 'personal requests'
            }
            return t
        }
    },
    methods: {
        async switchType () {
            this.$refs.requests_search.clearRequests()
            this.manualSwitchType = (this.type === 'researcher' && this.hasOrgs) ? 'organization' : 'researcher'
            await this.$nextTick()
            this.$refs.requests_search.fetchRequests(true)
        }
    }
}
</script>
