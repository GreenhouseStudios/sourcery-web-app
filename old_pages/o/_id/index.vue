<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <organization-app-bar
        :organization="organization"
      />

      <v-btn
        v-if="isAdmin"
        color="primary"
        large
        :to="`/o/${organization.slug}/manage`"
      >
        Manage
      </v-btn>
      <sourcery-card title="Repositories" class="mt-4">
        <v-list
          v-if="organization.repositories"
          color="transparent"
          class="mt-2 mx-2"
        >
          <template
            v-for="(repo, index) in organization.repositories"
          >
            <v-list-item
              color="transparent"
            >
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ repo.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ repoAddress( repo ) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action v-if="showRequestButton">
                <v-btn
                  color="primary"
                  outlined
                  large
                  @click="makeRequestAtRepository(repo)"
                >
                  Make a request
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider v-if="index !== organization.repositories.length - 1" class="my-2" />
          </template>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>No Repositories</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </sourcery-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import SourceryCard from '@/components/card-with-header.vue'
import OrganizationAppBar from '@/components/organization-app-bar.vue'
import { Organization } from '~/models/Organization'
import { Repository } from '~/models/Repository'

export default {
    name: 'Organization',
    components: {
        SourceryCard,
        OrganizationAppBar
    },
    async asyncData ({ params, store }) {
        const organization = await Organization.getBySlug(params.id)

        return {
            organization
        }
    },
    computed: {
        ...mapGetters({
            isAdmin: 'supabaseAuth/isAdmin',
            authUser: 'supabaseAuth/authUser'
        }),
        showRequestButton () {
            if (this.isAdmin) {
                return true
            }

            if (this.$utils.isTestUser(this.authUser)) {
                if (this.$utils.isATestOrganization(this.organization)) {
                    return true
                }
                return false
            }
            return true
        }
    },
    methods: {
        repoAddress (repo) {
            let addr = repo.address1
            if (repo.address2) {
                addr += `, ${repo.address2}`
            }
            if (repo.city) {
                addr += `, ${repo.city}`
            }
            if (repo.state) {
                addr += ` ${repo.state}`
            }
            if (repo.postal_code) {
                addr += `, ${repo.postal_code}`
            }
            if (repo.country_code) {
                addr += `, ${repo.country_code}`
            }
            return addr
        },
        async makeRequestAtRepository (repo) {
            const repository = await Repository.getById(repo.id)
            this.$store.commit('supabaseCreate/setRepository', repository)
            this.$router.push('/request/create')
        }
    }
}
</script>
<style scoped>
.container {
  max-width: 100vw;
}
</style>
