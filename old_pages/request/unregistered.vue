<template>
  <v-layout>
    <v-flex
      xs12
      sm10
      offset-sm-1
    >
      <h1 class="mb-4">
        Unregistered Requests
      </h1>

      <p>These requests were submitted to a location not yet registered with Sourcery.  Not to worry - we're reaching out for you, but a response is not guaranteed.</p>

      <div class="requests-prospective-section mt-6">
        <sourcery-card title="Requests" icon="mdi-file-search">
          <v-card v-for="request in requests" class="mt-4 mb-4">
            <v-card-title>{{ request.title }}</v-card-title>
            <v-card-subtitle>Submitted {{ readableDate(request.created_at) }}</v-card-subtitle>
            <v-card-text>
              <span><strong>Repository:</strong> {{ request.repository_name }}</span><br>
              <span>
                <strong>Repository Location:</strong> {{ request.repository_location }}
              </span>
              <p class="mt-2">
                <strong>Description:</strong> {{ request.description }}
              </p>
            </v-card-text>
          </v-card>
        </sourcery-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import SourceryCard from '@/components/card-with-header.vue'

export default {
    name: 'ProspectiveRequests',
    components: {
        SourceryCard
    },
    async asyncData ({ store }) {
        await store.dispatch('supabaseProspective/getForUser')
        return {}
    },
    computed: {
        ...mapGetters({
            requests: 'supabaseProspective/requests'
        })
    },
    methods: {
        readableDate (dateString) {
            const d = new Date(dateString)
            return d.toLocaleString('en-us', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })
        }
    }
}
</script>
