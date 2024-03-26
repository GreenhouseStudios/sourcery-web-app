<template>
  <v-layout>
    <v-row>
      <v-col>
        <h1>Select a Request</h1>
        <v-text-field label="Request Title" />

        <p v-for="(request, index) in requests" @click="selectRequest(request)">
          {{ request }}
        </p>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'

export default {
    async asyncData ({ store }) {
        const requests = await Request.getForCreator(store.getters['supabaseAuth/authUser'].id, ['Submitted', 'In Progress', 'Complete'])
        return {
            requests
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        })
    },
    methods: {
        // Initializes a new message for a request.
        async selectRequest (request) {
            await request.initializeChat(this.user.id, request.canManage(this.userRepositories))
            this.$router.push('/messages')
        }
    }
}
</script>
