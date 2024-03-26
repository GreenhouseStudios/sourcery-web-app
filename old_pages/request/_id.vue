<template>
  <v-layout>
    <v-flex xs12 sm10 xl8 offset-sm1 offset-xl2>
      <template v-if="!id">
        <v-alert type="error" :value="true">
          The request does not exist or was deleted.
        </v-alert>
        <v-btn color="primary" to="/">
          Dashboard
        </v-btn>
      </template>
      <template v-if="id">
        <h1 class="mb-6">
          {{ pageTitle }}
        </h1>

        <v-card v-if="!isComplete && !isArchived" class="pa-5 mb-4">
          <v-card-text>
            <v-row>
              <v-col>
                <div class="text-h5 mb-2">
                  <v-row>
                    <v-col cols="9">
                      <span v-if="!editing">{{ requestLabel }}</span>
                      <v-text-field v-else v-model="editingLabelValue" label="Edit Label" class="edit-label" />
                    </v-col>
                    <v-col cols="3" class="d-flex">
                      <v-tooltip top>
                        <template #activator="{ attrs, on }">
                          <v-btn
                            dark
                            small
                            fab
                            class="mx-2"
                            v-bind="attrs"
                            @click="labelButtonAction"
                            v-on="on"
                          >
                            <v-icon>
                              {{ labelActionButtonIcon }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>{{ labelActionButtonTooltipText }}</span>
                      </v-tooltip>

                      <v-tooltip v-if="editing" top>
                        <template #activator="{ attrs, on }">
                          <v-btn
                            dark
                            small
                            fab
                            class="mx-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="cancelLabelEdit"
                          >
                            <v-icon>
                              mdi-close
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>Cancel Edit</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </div>

                <span :class="$vuetify.theme.dark ? 'citation' : 'grey--text text--darken-4 citation'">{{ request.citation }}</span>

                <v-divider class="mt-3 mb-3" />

                <div>
                  Created {{ dateAndTimeElapsed }}
                </div>

                <div class="text-h6">
                  <strong>Status</strong>: {{ prettyStatus }}
                </div>

                <div class="text-h6">
                  <strong>Repository</strong>: {{ request.repository.name }}
                </div>

                <div class="text-h6">
                  <strong>Institution</strong>: {{ request.repository.organization.name }}
                </div>

                <div v-if="requestEmail" class="text-h6">
                  <strong>Request Email</strong>: {{ requestEmail }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mr-2">
            <v-spacer />
            <request-actions-dropdown-button
              :request="request"
              @requestActionsDispatch="handleRequestAction"
            />
          </v-card-actions>
        </v-card>

        <v-row v-else class="mb-4">
          <v-col cols="12" md="6">
            <card-with-header :title="requestLabel">
              <v-card-text class="py-4">
                <button-download text="Download Files" :request="request" />
              </v-card-text>
              <v-card-text>
                <div class="mb-4">
                  <h3>Repository:</h3>
                  <p>{{ request.repository.name }}</p>
                </div>
                <div class="mb-4">
                  <h3>Date Submitted:</h3>
                  <p>{{ dateCreated }}</p>
                </div>
                <div class="mb-4">
                  <h3>Date Completed:</h3>
                  <p>{{ dateLastUpdated }}</p>
                </div>
                <div class="mb-4">
                  <h3>Your Citation:</h3>
                  <p>{{ request.citation }}</p>
                </div>
              </v-card-text>
            </card-with-header>
          </v-col>
          <v-col cols="12" md="6">
            <card-with-header :title="messagesCardTitle">
              <v-card-text>
                <chat-list :request="request" />
              </v-card-text>
            </card-with-header>

            <card-with-header title="Archive's Citation(s)">
              <v-card-text class="py-3">
                <copy-text-box :text="request.archive_citation" />
              </v-card-text>
            </card-with-header>

            <button-large text="Print History and Citations" :click-action="print" :disabled="printingLoading" />
          </v-col>
        </v-row>

        <v-row v-if="isComplete || isArchived">
          <v-col>
            <card-with-header title="Archive's Notes">
              <v-card-text class="py-3">
                {{ requestArchiveNotesRead }}
              </v-card-text>
            </card-with-header>
          </v-col>
        </v-row>

        <request-events v-if="canManage" :request="request" />

        <v-card v-if="!isComplete && !isArchived && canManage" class="my-3 px-4">
          <v-card-title>General Notes &amp; Links</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="requestArchiveNotes"
              outlined
              rows="3"
              placeholder="Type any notes, links, and context here..."
              counter
              :rules="[$sourceryForms.rules.largeTextAreaCounter]"
              @change="saveInProgress"
            />
          </v-card-text>
        </v-card>

        <v-card v-if="canManage && !isArchived && !isComplete" class="px-4 py-2 mb-4">
          <file-manager :id="id" title="Attachments" title-class="text-h6" />
        </v-card>

        <Attachments v-if="!canManage || isArchived || isComplete" />

        <v-card v-if="!isComplete && !isArchived && canManage" class="my-3 px-4">
          <v-card-title>Corrected Citation</v-card-title>
          <v-card-text>
            <v-checkbox v-model="showCorrectedCitation" label="Provide a corrected citation?" />
            <v-textarea
              v-if="showCorrectedCitation"
              v-model="requestArchiveCitation"
              outlined
              rows="3"
              placeholder="Place a corrected citation here if applicable."
              counter
              :rules="[$sourceryForms.rules.largeTextAreaCounter]"
              @change="saveInProgress"
            />
          </v-card-text>
        </v-card>

        <v-card v-if="!isComplete && !isArchived && canManage && !hasAttachments" class="my-4 px-5">
          <v-card-text>
            <v-checkbox
              v-model="hasSatisfiedRequestInText"
              class="font-size-20"
              label="Mark as Resolved with no Attachments"
            />
            <p>This is useful for situations where you might not have the documents or capacity to fulfill the request.  A completed request with context will provide a better experience for the end user than cancelling.</p>

            <v-textarea
              v-if="hasSatisfiedRequestInText"
              v-model="requestArchiveNotes"
              outlined
              rows="3"
              placeholder="Type any notes, links, and context here..."
              counter
              :rules="[$sourceryForms.rules.largeTextAreaCounter]"
              @change="saveInProgress"
            />
          </v-card-text>
        </v-card>

        <!-- All of the actions for users who can manage the request. -->
        <div v-if="canManage" class="d-flex justify-space-between my-4">
          <div>
            <v-btn to="/dashboard" color="secondary">
              Back
            </v-btn>
          </div>
          <div>
            <p class="float-left mr-4 mt-1">
              <em v-if="!draftSaveInProgress">Draft Saved</em>
              <em v-else>Draft saving in progress...</em>
            </p>
            <v-btn v-if="isSubmitted" class="px-4" color="primary" @click="pickUp">
              Move to In Progress
            </v-btn>
            <v-btn v-if="(isComplete || isCancelled) && !isArchived" class="px-4" color="primary" @click="archive">
              Archive
            </v-btn>
            <v-btn v-if="isPickedUp" class="px-4" color="primary" :disabled="!canComplete" @click="openCompleteRequestDialog()">
              Complete
            </v-btn>
          </div>
        </div>
      </template>
    </v-flex>
    <dialog-general ref="confirmCompleteDialog">
      <v-card class="px-10 pt-10 pb-6">
        <div>
          <h3>Ready to complete the request?</h3>
          <p>Doing so will move the request to your "Completed" section, send a notification to the client, and you will not be able to add any more files.</p>
        </div>
        <div class="d-flex justify-space-between mt-10">
          <v-btn @click="cancelCompleteRequest">
            Not Finished Yet
          </v-btn>
          <v-btn color="primary" :disabled="completeLoading" @click="completeRequest">
            <loading-icon v-if="completeLoading" />
            Complete
          </v-btn>
        </div>
      </v-card>
    </dialog-general>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
// import Attachments from '@/components/attachments'
import { RequestComment } from '~/models/RequestComment'

export default {
    name: 'RequestId',
    // components: {
    //     Attachments
    // },
    async middleware ({ store, params, redirect }) {
        // Populate vuex store here, since we depend on it for access rights
        await store.dispatch('supabaseRequest/getById', params.id)
        /**
         * This block is specifically for blocking users who are not able to fulfill a request, or not the original requester, from seeing details about other requests.
        */
        const request = store.getters['supabaseRequest/request']
        const user = store.getters['supabaseAuth/authUser']
        const userRepositories = store.getters['supabaseAuth/userRepositories']

        const canManage = userRepositories.map(x => x.id).includes(request.repository_id)
        const isRequester = user.id === request.user_id

        if (!canManage && !isRequester) {
            return redirect('/dashboard')
        }
    },

    async asyncData ({ store }) {
        const messageCount = await RequestComment.countForRequest(store.getters['supabaseRequest/request'])
        return {
            messageCount
        }
    },
    data () {
        return {
            editing: false,
            editingLabelValue: '',
            hasSatisfiedRequestInText: false,
            completeLoading: false,
            draftSaveInProgress: false,
            showCorrectedCitation: false,
            printingLoading: false
        }
    },
    computed: {
        ...mapGetters({
            id: 'supabaseRequest/id',
            request: 'supabaseRequest/request',
            isComplete: 'supabaseRequest/isComplete',
            isPickedUp: 'supabaseRequest/isPickedUp',
            isArchived: 'supabaseRequest/isArchived',
            isSubmitted: 'supabaseRequest/isSubmitted',
            isCancelled: 'supabaseRequest/isCancelled',
            prettyStatus: 'supabaseRequest/prettyStatus',
            user: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
        requestArchiveNotes: {
            get () {
                return this.request.archive_notes ? this.request.archive_notes : ''
            },
            set (val) {
                this.setArchiveNotes(val)
            }
        },
        requestArchiveCitation: {
            get () {
                return this.request.archive_citation ? this.request.archive_citation : ''
            },
            set (val) {
                this.setArchiveCitation(val)
            }
        },
        requestArchiveNotesRead () {
            return this.request.archive_notes ? this.request.archive_notes : 'No notes provided.'
        },
        dateAndTimeElapsed () {
            if (this.request && this.request.created_at) {
                const t = new Date(Date.UTC(1970, 0, 1))
                const c = new Date(this.request.created_at)
                t.setUTCSeconds(c.getTime() / 1000)

                // Current Time
                const current = new Date()

                const diff = current.getTime() - t.getTime()
                const diffMinutes = (diff / 1000) / 60
                const minutes = Math.floor(diffMinutes % 60)
                const minutesAsString = minutes < 10 ? '0' + minutes : minutes

                const diffHours = Math.floor(diffMinutes / 60)
                const hours = diffHours % 24

                const diffDays = Math.floor(diffHours / 24)
                const days = diffDays

                const elapsedString = `Elapsed: ${days} days, ${hours} hours, ${minutesAsString} minutes`

                return `${t.toLocaleString('default', { month: 'long' })} ${t.getDate()}, ${t.getFullYear()} (${elapsedString})`
            }
            return null
        },
        dateCreated () {
            const d = new Date(this.request.created_at)
            return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
        },
        dateLastUpdated () {
            const d = new Date(this.request.updated_at)
            return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
        },
        isOwner () {
            return this.user.id === this.request.user_id
        },
        canManage () {
            return this.userRepositories.map(x => x.id).includes(this.request.repository_id)
        },
        requestLabel () {
            if (this.isOwner) {
                return this.request.request_client.label
            }
            return this.request.request_vendor.label
        },
        pageTitle () {
            if (this.isComplete || this.isArchived) {
                return 'Request Receipt'
            }

            if (this.canManage) {
                return 'Fulfill Request'
            }

            return 'Request Summary'
        },
        featuredImageSrc () {
            return this.request.repository.featured_image?.url
        },
        labelActionButtonIcon () {
            if (this.editing) {
                return 'mdi-content-save'
            }
            return 'mdi-pencil'
        },
        labelActionButtonTooltipText () {
            if (this.editing) {
                return 'Save Label'
            }
            return 'Edit Label'
        },
        requestEmail () {
            return this.request.user?.email ? this.request.user.email : false
        },
        messagesCardTitle () {
            return `Message History (${this.messageCount})`
        },
        hasAttachments () {
            return this.request.attachments?.length > 0
        },
        canComplete () {
            if (!this.canManage) {
                return false
            }

            if (this.hasAttachments) {
                return true
            }

            if (this.hasSatisfiedRequestInText && this.requestArchiveNotes.length > 0) {
                return true
            }

            return false
        }
    },
    mounted () {
        this.editingLabelValue = this.requestLabel
    },
    methods: {
        ...mapMutations({
            setArchiveNotes: 'supabaseRequest/setArchiveNotes',
            setArchiveCitation: 'supabaseRequest/setArchiveCitation'
        }),
        ...mapActions({
            requestCancel: 'supabaseRequest/cancel',
            requestArchive: 'supabaseRequest/archive',
            requestPickUp: 'supabaseRequest/pickUp',
            saveLabel: 'supabaseRequest/setLabel',
            startChat: 'supabaseChat/openForRequest',
            complete: 'supabaseRequest/complete',
            update: 'supabaseRequest/update',
            sendRequestEventRPC: 'supabaseRequest/sendRequestEventRPC'
        }),
        async archive () {
            if (confirm('Are you sure you want to archive this item? This action cannot be undone.')) {
                const archive_status = await this.requestArchive()
                if (archive_status) {
                    this.$router.push({ name: 'dashboard' })
                } else {
                    console.log('Error archiving request.')
                }
            }
        },
        async cancel () {
            if (confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
                const delete_status = await this.requestCancel()
                if (delete_status) {
                    this.$router.push({ name: 'dashboard' })
                } else {
                    console.log('Error deleting request.')
                }
            }
        },
        async pickUp () {
            if (confirm('Are you sure you want to claim this request, and move it to in-progress?')) {
                const in_progress = await this.requestPickUp()
                if (in_progress) {
                    console.log('Success picking up request.')
                } else {
                    console.log('Error picking up request.')
                }
            }
        },
        async labelButtonAction () {
            if (this.editing) {
                this.editing = false
                const payload = {
                    client: this.isOwner,
                    label: this.editingLabelValue
                }
                const result = await this.saveLabel(payload)
                if (result) {
                    this.$toast.success('Label saved successfully.')
                    return
                }
                this.$toast.error('Issue saving label.')
            } else {
                this.editing = true
            }
        },
        cancelLabelEdit () {
            this.editing = false
            this.editingLabelValue = this.requestLabel
        },
        async print () {
            this.printingLoading = true
            await this.sendRequestEventRPC('request_printed')
            window.print()
            this.printingLoading = false
        },
        openCompleteRequestDialog () {
            this.$refs.confirmCompleteDialog.openDialog()
            console.log('Probably show a modal here.')
        },
        cancelCompleteRequest () {
            this.$refs.confirmCompleteDialog.closeDialog()
        },
        async completeRequest () {
            this.completeLoading = true
            await this.complete()
            this.completeLoading = false
            this.$toast.success('Request completed!')
            this.$refs.confirmCompleteDialog.closeDialog()
        },
        async saveInProgress () {
            this.draftSaveInProgress = true
            const updated = await this.update({
                archive_notes: this.requestArchiveNotes,
                archive_citation: this.requestArchiveCitation
            })
            if (!updated) {
                this.$toast.error('Issue saving draft.')
            }
            this.draftSaveInProgress = false
        },
        handleRequestAction (action) {
            switch (action) {
            case 'openChat':
                this.startChat(this.request)
                break
            case 'editLabel':
                this.editing = true
                break
            case 'cancelRequest':
                this.cancel()
                break
            case 'archiveRequest':
                this.archive()
                break
            }
        }
    }
}
</script>

<style scoped>
.citation {
    font-family: 'Courier New', Courier, monospace;
    font-size: 16px;
}

.transparent-card {
  background-color: transparent;
  border: 1px solid #707070;
}
</style>

<style lang="scss">
.font-size-20 .v-label {
  font-size: 20px;
}
</style>
