<template>
  <v-flex>
    <h1 class="mb-4">
      Prospective Request Details
    </h1>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-text>
            <h3>Prospective Request ID</h3>
            <p>{{ request.id }}</p>

            <h3>Created At</h3>
            <p>{{ request.created_at | normalDate }}</p>

            <h3>Created By</h3>
            <p>{{ request.user.email }} - {{ request.user.name }}</p>

            <h3>Location</h3>
            <p>{{ request.repository_name }}</p>
            <p>{{ request.repository_location }}</p>

            <h3>Title</h3>
            <p>{{ request.title }}</p>

            <h3>Description</h3>
            <p>{{ request.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <repository-search ref="repository_search" :custom="false" @selected="setRepository" />

        <div class="d-flex align-center">
          <v-btn
            color="primary"
            depressed
            small
            :disabled="!canSubmit"
            class="mr-2"
            @click="convertRequest()"
          >
            Convert to Request
          </v-btn>
          <v-progress-circular
            :class="{ hidden: !isLoading }"
            indeterminate
            color="primary"
          />
        </div>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import { RequestsProspective } from '~/models/RequestsProspective'

export default {
    middleware: 'auth-guard',
    async asyncData ({ params }) {
        const request = await RequestsProspective.getById(params.id)
        return { request }
    },
    data () {
        return {
            request: {},
            selectedRepository: null,
            isLoading: false
        }
    },
    computed: {
        canSubmit () {
            return this.selectedRepository?.id && !this.isLoading
        }
    },
    methods: {
        async convertRequest () {
            this.isLoading = true
            if (this.selectedRepository?.id) {
                const new_request = await this.request.convert(this.selectedRepository.id)
                if (Array.isArray(new_request) && new_request.length > 0) {
                    this.$router.push('/uri')
                }
            }
            this.isLoading = false
        },
        setRepository (repository) {
            this.selectedRepository = repository
        }
    }
}
</script>

<style>
.hidden {
    visibility: hidden;
}
</style>
