<template>
  <div class="request-events">
    <v-card class="px-5">
      <v-card-title class="flex-nowrap">
        <span>Request Activity Log &amp; Internal Notes</span>

        <v-spacer />

        <v-btn icon x-large class="ml-3">
          <v-icon @click="show = !show">
            {{ toggleIcon }}
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <v-card-text v-show="show">
          <v-row>
            <v-col md="4" lg="3" cols="6">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="SORT BY"
                outlined
                dense
                clearable
              />
            </v-col>
          </v-row>
          <div class="event-scroller">
            <v-simple-table
              fixed-header
              :height="tableHeight"
              dense
              class="sourcery-simple-table"
            >
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left text-md-h5 pa-2 pl-4 font-weight-medium">
                      Action / Notes
                    </th>
                    <th class="text-left text-md-h5 pa-2 pl-4 font-weight-medium">
                      Date/Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(event, index) in eventRows"
                  >
                    <td class="py-2">
                      {{ event.text }}
                    </td>
                    <td class="py-2">
                      {{ event.time | shortDateAndTime }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <v-btn v-if="showAddNote" color="primary" class="mt-4 mb-3" @click="openAddNote">
            + Add Note
          </v-btn>
        </v-card-text>
      </v-expand-transition>
    </v-card>
    <dialog-general ref="internalNoteDialog">
      <v-card>
        <v-card-title>Add Internal Note.</v-card-title>
        <v-card-text>
          <p>Here you can write a custom note.</p>
          <p>Custom wildcards are supported.  %u will add your user's name, %s will substitute in the status of the request.</p>

          <v-alert v-if="errorMessage" type="error" dense>
            {{ errorMessage }}
          </v-alert>

          <v-textarea v-model="newNoteText" label="Note Text" placeholder="Write an internal note here." outlined counter />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="danger" @click="closeAddNote">
            Cancel
          </v-btn>
          <v-btn text color="primary" :disabled="addDisabled" @click="addInternalNote">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </dialog-general>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'
import { RequestEvent } from '~/models/RequestEvent'
export default {
    props: {
        request: {
            type: Request,
            required: true
        }
    },
    data () {
        return {
            events: [],
            sortBy: null,
            sortOptions: [
                'Oldest First',
                'Recent First',
                'User'
            ],
            show: true,
            newNoteText: '',
            errorMessage: '',
            loading: false
        }
    },
    async fetch () {
        await this.refreshEvents()
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        tableHeight () {
            const avgHeight = 32
            const pad = 120
            const predictedHeight = (avgHeight * this.events.length) + pad
            const ceiling = 250

            if (predictedHeight < ceiling) {
                return `${predictedHeight}px`
            }
            return `${ceiling}px`
        },
        toggleIcon () {
            if (this.show) {
                return 'mdi-chevron-up'
            }
            return 'mdi-chevron-down'
        },
        addDisabled () {
            return this.newNoteText &&
                !this.loading &&
                (this.newNoteText.length < 1 ||
                this.newNoteText.length > 10000)
        },
        showAddNote () {
            return !Request.isComplete(this.request) && !Request.isArchived(this.request)
        },
        eventRows () {
            let e = this.events.map((x) => {
                return {
                    text: this.eventText(x),
                    time: x.created_at,
                    user_id: x.user_id
                }
            })
            e.unshift({
                text: 'Request created.',
                time: this.request.created_at,
                user_id: null
            })
            e.push({
                text: 'Current',
                time: new Date().toISOString(),
                user_id: null
            })

            if (this.sortBy) {
                switch (this.sortBy) {
                case 'Oldest First':
                    e.sort(this.$sourcerySorts.sortByTimePropertyAsc)
                    break
                case 'Recent First':
                    e.sort(this.$sourcerySorts.sortByTimePropertyDesc)
                    break
                case 'User':
                    e = this.$sourcerySorts.sortGroupedByProp(e, 'user_id')
                    break
                default:
                    break
                }
            }

            return e
        }
    },
    methods: {
        eventText (event) {
            const description = event.description
                .replace('%s', event.status?.name)

            let userReplaceString = ''

            if (event.user) {
                if (event.user.name) {
                    userReplaceString = event.user.name
                }

                if (event.user.id === this.request.repository?.organization?.owner_id) {
                    if (userReplaceString) {
                        userReplaceString += ' (Vendor)'
                    } else {
                        userReplaceString += 'Vendor'
                    }
                } else if (event.user.id === this.request.user_id) {
                    if (userReplaceString) {
                        userReplaceString += ' (Client)'
                    } else {
                        userReplaceString += 'Client'
                    }
                }
            }

            if (!userReplaceString) {
                userReplaceString = 'User'
            }

            return description.replace('%u', userReplaceString)
        },
        openAddNote () {
            this.clear()
            this.$refs.internalNoteDialog.openDialog()
        },
        closeAddNote () {
            this.$refs.internalNoteDialog.closeDialog()
        },
        clear () {
            this.newNoteText = ''
            this.errorMessage = ''
        },
        async refreshEvents () {
            this.events = await RequestEvent.getForRequestId(this.request.id)
        },
        async addInternalNote () {
            const reqEvent = new RequestEvent({
                request_id: this.request.id,
                user_id: this.user.id,
                description: this.newNoteText
            })

            const result = await reqEvent.insert()

            if (result === false) {
                this.errorMessage = 'Oops, something went wrong on our end.'
            }

            if (result === null) {
                this.errorMessage = 'Rate limited - please wait a bit before saving another message.'
            }

            if (result) {
                this.show = true
                this.errorMessage = ''
                await this.refreshEvents()
                this.closeAddNote()
            }
        }
    }
}
</script>

<style scoped>
.event-scroller {
    border: 2px solid #3b3b3b;
    border-radius: 5px;
}

.sourcery-simple-table td {
    border-bottom: none!important;
}

.sourcery-simple-table th {
    box-shadow: none!important;
}
</style>
