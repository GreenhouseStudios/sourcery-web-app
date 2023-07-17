<template>
  <v-hover
    v-slot="{ hover }"
    :key="request.id"
  >
    <v-card
      v-if="request"
      :to="cardClickAction"
      class="my-4 rounded-lg request-card"
      :color="cardColor"
    >
      <v-container>
        <v-row class="row-flex">
          <v-col
            cols="auto"
            :class="labelClass"
            z-index="2"
          />
          <v-col class="pa-0 content-col">
            <v-card-title v-if="!editing">
              <span class="text-truncate request-label" style="max-width: 300px;">{{ label }}</span>
            </v-card-title>
            <v-card-title v-else>
              <v-text-field v-model="editingLabelValue" class="edit-label" label="Edit Label" />
            </v-card-title>
            <v-card-subtitle>
              <span v-if="client">{{ request.repository.name }}</span>
              <div v-else>
                <span v-if="requestUser && requestUser.name">{{ requestUser.name }}</span>
                <span v-if="requestUser && !requestUser.name" class="text-truncate" style="max-width: 200px;display: block;">{{ requestUser.email }}</span>
              </div>
              <span v-if="isSubmitted" class="font-italic font-weight-light">
                Submitted {{ formatDate(request.created_at) }}
              </span>
              <span v-if="isPickedUp" class="font-italic font-weight-light">
                In Progress
              </span>
              <span v-if="isPostAction" class="font-italic font-weight-light">
                {{ status }}
              </span>
            </v-card-subtitle>
            <v-fade-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="primary"
                opacity="0.1"
                class="rounded-lg"
                z-index="1"
              />
            </v-fade-transition>
          </v-col>
          <v-col v-if="requestActionsList.length > 0" cols="auto" align-self="center" class="pr-0 mobile-friendly1">
            <v-menu offset-y>
              <template #activator="{ on: { click }, attrs }">
                <v-btn
                  fab
                  dark
                  small
                  :color="actionButtonColor"
                  style="z-index:1"
                  v-bind="attrs"
                  @click.stop.prevent="click"
                >
                  <v-icon dark>
                    mdi-dots-horizontal
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in requestActionsList"
                  :key="index"
                  @click.prevent="item.action"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="auto" align-self="center" class="pr-4 mobile-friendly2">
            <v-btn
              fab
              dark
              small
              :color="actionButtonColor"
              style="z-index:1"
              @click.prevent="openChat"
            >
              <v-icon dark>
                mdi-message-processing
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-hover>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Request } from '~/models/Request'

export default {
    props: {
        request: {
            type: Object,
            required: true
        },
        client: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            editing: false,
            editingLabelValue: '',
            requestUser: null
        }
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
        isClient () {
            return this.request.user_id === this.authUser.id
        },
        label () {
            if (!this.client) {
                return this.request.request_vendor.label
            }
            return this.request.request_client.label
        },
        status () {
            const s = this.request?.status?.name
            if (!s) {
                return 'Created'
            }
            return s
        },
        isSubmitted () {
            return Request.isSubmitted(this.request)
        },
        isPickedUp () {
            return Request.isPickedUp(this.request)
        },
        isPostAction () {
            return Request.isCancelled(this.request) || Request.isComplete(this.request) || Request.isArchived(this.request)
        },
        labelClass () {
            let classes = 'd-flex align-center justify-center rounded-l-lg px-2'
            const status_name = this.request?.status?.name
            if (status_name === 'Submitted') {
                classes += ' bg-teal'
            } else if (status_name === 'In Progress') {
                classes += ' bg-blue'
            } else if (status_name === 'Complete' || status_name === 'Archived' || status_name === 'Cancelled') {
                classes += ' bg-purple'
            }

            return classes
        },
        showLabelEdit () {
            const statuses = ['Submitted', 'In Progress']
            return statuses.includes(this.request.status.name)
        },
        showChatInit () {
            const statuses = ['In Progress', 'Complete']
            return statuses.includes(this.request.status.name)
        },
        showPickUp () {
            return Request.isSubmitted(this.request) && Request.canManage(this.userRepositories, this.request)
        },
        actionButtonColor () {
            return this.$vuetify.theme.dark ? '#707070' : '#C3C3C3'
        },
        cardColor () {
            return this.$vuetify.theme.dark ? 'grey darken-3' : ''
        },
        cardClickAction () {
            if (this.editing) {
                return undefined
            }
            return '/request/' + this.request.id
        },
        requestActionsList () {
            const list = []
            if (this.showLabelEdit) {
                if (this.editing) {
                    list.push({
                        name: 'Save Label',
                        action: this.saveLabel
                    })
                }
                list.push({
                    name: this.editing ? 'Cancel Editing' : 'Edit Label',
                    action: this.editLabel
                })
            }
            if (this.showChatInit) {
                list.push({
                    name: 'Open Chat',
                    action: this.openChat
                })
            }

            if (this.showPickUp) {
                list.push({
                    name: 'Move to In Progress',
                    action: this.pickUp
                })
            }

            return list
        }
    },
    created () {
        this.editingLabelValue = this.label
        if (!this.client) {
            this.fetchRequestUser()
        }
    },

    methods: {
        ...mapActions({
            startChat: 'supabaseChat/openForRequest',
            getUser: 'supabaseUserCache/get_user'
        }),
        editLabel () {
            this.editing = !this.editing
            console.log('edit label')
        },
        fetchRequestUser () {
            if (this.requestUser) {
                return
            }
            this.getUser(this.request.user_id).then((user) => {
                if (user) {
                    this.requestUser = user
                }
            })
        },
        openChat () {
            this.startChat(this.request)
        },
        async saveLabel () {
            this.editing = false
            if (this.request instanceof Request) {
                const result = await this.request.saveLabel(this.client, this.editingLabelValue)
                if (result) {
                    this.$toast.success('Label saved successfully.')
                    return
                }
            }
            this.$toast.error('Issue saving label.')
        },
        async pickUp () {
            if (this.request instanceof Request) {
                const result = await this.request.pickUp()
                if (result) {
                    this.$toast.success('Picked up request.')
                    this.$emit('requestUpdated')
                    return
                }
            }
            this.$toast.error('Issue picking up request.')
        },
        formatDate (dateString) {
            const date = new Date(dateString)
            const options = { year: 'numeric', month: 'short', day: 'numeric' }
            const formattedDate = date.toLocaleDateString('en-US', options)
            const suffixes = ['th', 'st', 'nd', 'rd']
            const day = date.getDate()
            const suffix = suffixes[(day - 20) % 10] || suffixes[day] || suffixes[0]
            return formattedDate.replace(/\b\d{1,2}\b/, `$&${suffix}`)
        }
    }
}
</script>

<style>
.bg-teal {
  background-color: #69ced5;
}

.bg-blue {
  background-color: #3686d4;
}

.bg-purple {
  background-color: #6b49a9;
}

.edit-label {
  z-index: 999;
}

.request-card {
  height: 108px;

  @media screen and (max-width: 380px) {
    height: 130px;
  }

  @media screen and (max-width: 333px) {
    height: 152px;
  }

  @media screen and (max-width: 300px) {
    height: 174px;
  }
}

.row-flex {
  display: flex;
  height: 100%;
}

.request-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-col {

  @media screen and (max-width: 480px) {
    max-width: 185px;
    overflow: hidden;
  }
}

.mobile-friendly1 {
  @media screen and (max-width: 400px) {
    padding-left: 0px;
  }
}

.mobile-friendly2 {
  @media screen and (max-width: 400px) {
    padding-right: 0px;
    padding-left: 6px;
  }
}

</style>
