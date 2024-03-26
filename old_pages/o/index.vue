<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1
        class="mb-4"
      >
        Organizations
      </h1>

      <v-card
        outlined
      >
        <v-list v-if="organizations">
          <template
            v-for="(org, index) in organizations"
          >
            <organization-list-item :organization="org" />
            <v-divider v-if="index !== organizations.length - 1" class="my-2" />
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import OrganizationListItem from '@/components/organization-list-item.vue'
import { Organization } from '~/models/Organization'

export default {
    name: 'Organizations',
    components: {
        OrganizationListItem
    },
    async asyncData () {
        const organizations = await Organization.getAll()
        return {
            organizations
        }
    }
}
</script>
