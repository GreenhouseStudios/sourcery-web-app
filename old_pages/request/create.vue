<template>
  <v-layout>
    <v-flex xs12 sm8 xl6 offset-sm2 offset-xl3>
      <h1 class="mb-3">
        Create a Request
      </h1>
      <h2 class="mb-3">
        Select Repository
      </h2>

      <v-img
        :src="selectedRepositoryImageUrl"
        max-height="200"
        class="repository-image mb-6 rounded-lg"
      />

      <repository-search ref="repository_search" @selected="setRepository" />

      <h2 class="mt-5 mb-3">
        Document Information
      </h2>
      <p v-if="selectedRepository">
        Currently requesting from {{ currentlyRequestingFromText }}
      </p>

      <v-row align="center" class="mb-4">
        <v-col v-if="!clientIsUser" cols="auto">
          <v-btn @click="revertToClient">
            Revert
          </v-btn>
        </v-col>
        <v-col>
          <user-lookup-modal v-if="ownsAnOrganization || isAdmin" :seed-email="clientEmail" @user-selected="clientSelected" />
        </v-col>
      </v-row>

      <v-form ref="createRequestForm" v-model="formValid" lazy-validation>
        <v-text-field
          v-model="clientName"
          :label="clientNameLabel"
          outlined
          required
          :rules="[$sourceryForms.rules.required]"
        />

        <v-text-field
          v-if="isLoggedIn"
          :label="clientEmailLabel"
          outlined
          readonly
          disabled
          :value="clientEmail"
        />
        <v-text-field
          v-else
          v-model="clientEmail"
          :label="clientEmailLabel"
          :rules="[$sourceryForms.rules.email]"
          outlined
        />

        <v-text-field
          v-model="label"
          label="Request Title*"
          outlined
          required
          :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount100]"
        />
        <p>Help your Sourcerer locate your document by providing as much relevant information as you have (e.g., page numbers, box or folder numbers, name of collections, etc.). Citations are appreciated but not necessary!</p>
        <v-textarea
          v-model="citation"
          label="Request Details"
          outlined
          placeholder="Type spells, potions, information, and citations (if you have them) here…"
          required
          :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]"
        />

        <card-disclaimer v-if="repositoryIsCustom" title="Requesting from Unregistered Institution">
          <p>If the institution you're looking for isn't already a registered user of Sourcery, our team will reach out to the institution to let them know that they have a request waiting. If they choose to fulfill the request through Sourcery, they will create an account and you will see your request status go to “in-progress”. Once the repository has fulfilled the request, you will receive your documents through the app.</p>
          <p>If an institution prefers not to fulfill the request through Sourcery, your request will not be fulfilled and will remain as “pending” on your dashboard. There is also a chance the repository will contact you directly via email.</p>
        </card-disclaimer>

        <div class="d-flex justify-space-between my-1 mb-5">
          <v-btn class="px-4" to="/dashboard">
            Back
          </v-btn>
          <v-btn class="px-4" color="primary" :disabled="!submitEnabled" @click="handleSubmit">
            Submit
          </v-btn>
        </div>
        <register-to-submit-request ref="register_to_submit_request_dialog" :submitting-request="true" />
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Repository } from '~/models/Repository'
import { RequestsProspective } from '~/models/RequestsProspective'

export default {
    data () {
        return {
            repositories: [],
            formValid: true,
            submitting: false,
            startingQuery: {}
        }
    },
    async fetch ({ route, store }) {
        this.repositories = await Repository.getActive()
        const { repo_id, message, title } = route.query

        // First if we have query items we should load that information
        // into create request.
        if (repo_id) {
            const matchedRepository = this.repositories.find(x => x.id === parseInt(repo_id))
            if (matchedRepository) {
                this.selectedRepository = matchedRepository
                store.commit('supabaseCreate/setRepository', matchedRepository)
            }
        }

        if (message) {
            store.commit('supabaseCreate/setCitation', message)
            this.citation = message
        }

        if (title) {
            this.label = title
            store.commit('supabaseCreate/setLabel', title)
        }

        // If we dont have this information already from an ongoing session
        // we should replace our create request info from localStorage
        const inProgressRequest = JSON.parse(localStorage.getItem('sourceryInProgressRequest'))
        if (inProgressRequest && inProgressRequest.request) {
            if (inProgressRequest.request.citation && !this.citation) {
                console.log('setting citation')
                store.commit('supabaseCreate/setCitation', inProgressRequest.request.citation)
            }

            if (inProgressRequest.request.clientName && !this.clientName) {
                store.commit('supabaseCreate/setClientName', inProgressRequest.request.clientName)
            }

            if (inProgressRequest.request.label && !this.label) {
                store.commit('supabaseCreate/setLabel', inProgressRequest.request.label)
            }

            if (inProgressRequest.request.selectedRepository && !this.selectedRepository) {
                store.commit('supabaseCreate/setRepository', new Repository(inProgressRequest.request.selectedRepository))
            }

            localStorage.removeItem('sourceryInProgressRequest')
        }
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            authUserMeta: 'supabaseAuth/authUserMeta',
            isAdmin: 'supabaseAuth/isAdmin',
            isLoggedIn: 'supabaseAuth/isLoggedIn',
            getSelectedRepository: 'supabaseCreate/repository',
            getLabel: 'supabaseCreate/label',
            getCitation: 'supabaseCreate/citation',
            getClientName: 'supabaseCreate/clientName',
            getClient: 'supabaseCreate/client',
            getClientEmail: 'supabaseCreate/clientEmail',
            ownsAnOrganization: 'supabaseAuth/ownsAnOrganization'
        }),
        clientEmail: {
            get () {
                return this.getClientEmail
            },
            set (val) {
                this.setClientEmail(val)
            }
        },
        clientIsUser () {
            return !(this.getClient && this.getClient.id && this.getClient.id !== this.authUser?.id)
        },
        clientEmailLabel () {
            if (!this.clientIsUser) {
                return 'Client Email'
            }
            return 'Your Email'
        },
        clientNameLabel () {
            if (!this.clientIsUser) {
                return 'Client Name'
            }
            return 'Your Name'
        },
        selectedRepository: {
            get () {
                return this.getSelectedRepository
            },
            set (val) {
                this.setRepository(val)
            }
        },
        label: {
            get () {
                return this.getLabel
            },
            set (val) {
                this.setLabel(val)
            }
        },
        citation: {
            get () {
                return this.getCitation
            },
            set (val) {
                this.setCitation(val)
            }
        },
        clientName: {
            get () {
                return this.getClientName
            },
            set (val) {
                this.setClientName(val)
            }
        },
        submitEnabled () {
            return this.selectedRepository &&
              this.formValid &&
              this.citation &&
              !this.submitting
        },
        repositoryIsCustom () {
            return typeof this.selectedRepository === 'string'
        },
        currentlyRequestingFromText () {
            return this.$utils.repositoryDisplayText(this.selectedRepository)
        },
        selectedRepositoryImageUrl () {
            if (this.selectedRepository && this.selectedRepository.featured_image?.url) {
                return this.selectedRepository.featured_image?.url
            }
            return this.$utils.defaultRepositoryPhoto()
        }
    },
    mounted () {
        this.setClient(this.authUser)
        if (this.authUserMeta?.name) {
            this.clientName = this.authUserMeta.name
        }

        if (this.selectedRepository) {
            this.$refs.repository_search.selectedRepositoryItem(this.selectedRepository)
        }
    },
    methods: {
        ...mapMutations({
            setRepository: 'supabaseCreate/setRepository',
            setLabel: 'supabaseCreate/setLabel',
            setCitation: 'supabaseCreate/setCitation',
            setClientName: 'supabaseCreate/setClientName',
            setClient: 'supabaseCreate/setClient',
            setClientEmail: 'supabaseCreate/setClientEmail'
        }),
        ...mapActions({
            submitRequest: 'supabaseCreate/insert'
        }),
        async submitRequestInsert () {
            this.submitting = true
            const r = await this.submitRequest()
            this.submitting = false
            if (r) {
                this.$toast.success('Successful!')
            }
            if (r && r instanceof RequestsProspective) {
                this.$router.push('/dashboard')
            } else if (Array.isArray(r) && r[0] && r[0].id) {
                this.$router.push(`/request/${r[0].id}`)
            }
        },
        clientSelected (user) {
            this.setClient(user)
        },
        revertToClient () {
            this.setClient(this.authUser)
        },
        handleSubmit () {
            if (this.isLoggedIn) {
                this.submitRequestInsert()
            } else {
                this.$refs.register_to_submit_request_dialog.openDialog(this.clientEmail)
            }
        }
    }
}
</script>
