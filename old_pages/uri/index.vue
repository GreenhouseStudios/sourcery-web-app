<template>
  <v-layout>
    <v-flex>
      <h1
        class="mb-4"
      >
        Unregistered Institution Requests ({{ requests.length }})
      </h1>

      <p>Below are prospective requests that have not yet been converted into a real request.</p>

      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                Created At
              </th>
              <th class="text-left">
                Created By
              </th>
              <th class="text-left">
                Location
              </th>
              <th class="text-left">
                Title
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-if="!requests.length"
                colspan="6"
              >
                No requests found.
              </td>
            </tr>
            <tr
              v-for="request in requests"
            >
              <td>{{ request.id }}</td>
              <td>{{ request.created_at | normalDate }}</td>
              <td>{{ request.user.name || request.user.email }}</td>
              <td>{{ request.repository_location }}</td>
              <td>{{ request.title }}</td>
              <td>
                <v-btn
                  color="primary"
                  depressed
                  small
                  @click="goToRequest(request.id)"
                >
                  View
                </v-btn>
                <v-btn
                  color="danger"
                  depressed
                  small
                  @click="openDeleteDialog(request)"
                >
                  Delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <dialog-general
        ref="deleteRequestDialog"
        :width="600"
      >
        <v-card>
          <v-card-title>Delete Prospective Request</v-card-title>
          <v-card-text>Are you sure you want to delete this prospective request? It will still be available in the database which a developer can restore.</v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="closeDialog"
            >
              Cancel
            </v-btn>
            <v-btn
              color="danger"
              @click="deleteRequest"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </dialog-general>
    </v-flex>
  </v-layout>
</template>

<script>
import { RequestsProspective } from '~/models/RequestsProspective'

export default {
    name: 'UnregisteredInstitutionRequests',
    components: {},
    middleware: 'auth-guard',
    async asyncData () {
        const requests = await RequestsProspective.getNonConverted()
        console.log(requests)
        return {
            requests
        }
    },
    data () {
        return {
            requests: [],
            requestToDelete: null
        }
    },
    methods: {
        goToRequest (id) {
            this.$router.push(`/uri/${id}`)
        },
        async deleteRequest () {
            const status = await this.requestToDelete.delete()
            if (status) {
                this.$toast.success('Request deleted.')
                this.requests = this.requests.filter(r => r.id !== this.requestToDelete.id)
            } else {
                this.$toast.error('There was an error deleting the request.')
            }
            this.closeDialog()
        },
        closeDialog () {
            this.requestToDelete = null
            this.$refs.deleteRequestDialog.closeDialog()
        },
        openDeleteDialog (request) {
            this.requestToDelete = request
            this.$refs.deleteRequestDialog.openDialog()
        }
    }
}
</script>
