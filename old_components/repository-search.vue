<template>
  <div class="repository-search mb-4">
    <v-autocomplete
      ref="repository_search_auto"
      v-model="selectedRepository"
      outlined
      placeholder="Enter Repository"
      :items="visibleRepositories"
      item-text="organization.name"
      :search-input.sync="searchText"
      return-object
      :menu-props="{
        closeOnContentClick: true
      }"
      hide-details
      class="mb-4"
      @input="selectedRepositoryItem"
      @keyup.13="selectCreateNewRepository"
    >
      <template #prepend-item>
        <v-list-item v-if="custom" @click="selectCreateNewRepository">
          <v-list-item-content>
            <v-list-item-title>
              Submit New Repository: {{ searchText }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <em>Type to Add Repository; Select to Confirm</em>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template #no-data>
        <v-list-item class="no-data-menu-item" @click="selectCreateNewRepository">
          <v-list-item-content>
            <v-list-item-title>
              Submit New Repository: {{ searchText }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <em>Type to Add Repository; Select to Confirm</em>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template #item="{ item }">
        <v-list-item-content>
          <v-list-item-title>
            {{ item.organization.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ item.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>

    <repository-preview :repository="selectedRepository" @unselect="unselect" />

    <div v-if="isCustom" class="location-clarification mb-8">
      <h3 class="font-weight-medium mb-3">
        Let's make sure your request is clear.
      </h3>
      <v-text-field
        v-model="location"
        label="What is the town, state, and country this repository is located in?*"
        placeholder="What is the town, state, and country this repository is located in?*"
        outlined
        class="mb-4"
        hide-details
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Repository } from '~/models/Repository'

export default {
    props: {
        custom: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            repositories: [],
            selectedRepository: null,
            searchText: ''
        }
    },
    async fetch () {
        const repositories = [
            ...await Repository.getActive(),
            ...await Repository.getGhost(),
            ...await Repository.getOwned(this.userOrganizationIds)
        ]
        // Remove duplicates
        this.repositories = [...new Map(repositories.map(m => [m.id, m])).values()]
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            isAdmin: 'supabaseAuth/isAdmin',
            userOrganizationIds: 'supabaseAuth/userOrganizationIds',
            getLocation: 'supabaseCreate/location'
        }),
        location: {
            get () {
                return this.getLocation
            },
            set (val) {
                this.setLocation(val)
            }
        },
        visibleRepositories () {
            // Currently simple search.
            return this.repositories.filter((x) => {
                // const search_string = `${x.name} ${x.organization.name} ${x.address1} ${x.address2} ${x.city} ${x.state} ${x.postal_code}`

                if (this.isAdmin) {
                    return this.isAdmin
                }

                if (this.$utils.isTestUser(this.authUser)) {
                    if (this.$utils.isATestOrganization(x.organization)) {
                        return true
                    }
                    return false
                }

                if (!this.$utils.isATestOrganization(x.organization)) {
                    return true
                }

                return this.isAdmin
            })
        },
        isCustom () {
            if (typeof this.selectedRepository === 'string') {
                return true
            }
            return false
        }
    },
    methods: {
        ...mapMutations({
            setLocation: 'supabaseCreate/setLocation'
        }),
        selectedRepositoryItem (repository) {
            this.selectedRepository = repository
            this.$emit('selected', repository)
        },
        selectCreateNewRepository () {
            if (this.custom) {
                this.selectedRepository = this.searchText
                this.$emit('selected', this.searchText)
                this.$refs.repository_search_auto.blur()
            }
        },
        unselect () {
            this.selectedRepository = null
            this.$emit('selected', null)
        }
    }
}
</script>

<style lang="scss">
.theme--dark {
    .repository-item-list {
        border-color: rgba(255, 255, 255, 0.24);
    }
}
.repository-item-list {
    border: 1px solid rgba(0, 0, 0, 0.38);
    border-radius: 4px;
    padding: 16px 32px;
    margin-top: 4px;
    * {
        break-inside: avoid-column;
    }

    .repository-item-list-filter-row {
        width: 100%;
        display:flex;

        .browse-text {
            align-self: center;
        }
    }

    .repository-item-list-items {
        column-count: 2;
        padding-top: 10px;
    }
}

.repository-search {
    .v-text-field__details {
        display: none;
    }
}

.no-data-menu-item {
    display: none;
}

.location-clarification {
  h3 {
    font-size: 22px;
  }
}
</style>
