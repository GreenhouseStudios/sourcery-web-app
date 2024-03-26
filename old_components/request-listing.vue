<template>
  <v-hover v-slot="{ hover }">
    <v-sheet v-if="request" class="my-4 rounded-lg request-card d-flex align-center" :color="cardColor" @click="cardClickAction">
      <div :class="{ 'bg-teal': isSubmitted, 'bg-blue': isPickedUp, 'bg-purple': isPostAction }" class="color-bar rounded-l-lg" width="20" z-index="2" />
      <div class="request-card-content d-flex align-center justify-space-between w-100">
        <div class="request-card-content-text truncate-container pa-0">
          <p v-if="!editing" class="text-h6 mb-1 text-truncate">
            {{ label }}
          </p>
          <p v-else>
            <v-text-field v-model="editingLabelValue" class="edit-label" label="Edit Label" />
          </p>
          <div v-if="!editing">
            <p v-if="client" class="mb-1 text-truncate">
              {{ request.repository.name }}
            </p>
            <div v-else>
              <p v-if="requestUser && requestUser.name" class="mb-1">
                {{ requestUser.name }}
              </p>
              <p
                v-if="requestUser && !requestUser.name"
                class="text-truncate mb-1"
                style="max-width: 200px;display: block;"
              >
                {{ requestUser.email }}
              </p>
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
          </div>
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
        </div>
        <div class="request-card-actions d-flex">
          <div v-if="requestActionsList.length > 0" class="pa-2">
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
                <v-list-item v-for="(item, index) in requestActionsList" @click.prevent.stop="item.action">
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <div class="pa-2 pr-4">
            <v-btn
              fab
              dark
              small
              :color="actionButtonColor"
              style="z-index:1"
              @click.prevent.stop="openChat"
            >
              <v-icon dark>
                mdi-message-processing
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </v-sheet>
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
        },
        cardClickAction () {
            if (this.editing) {
                return undefined
            }
            this.$router.push({ path: '/request/' + this.request.id })
        }
    }
}
</script>

<style>
.w-100 {
  width: 100%;
}

.bg-teal {
  background-color: #69ced5;
}

.bg-blue {
  background-color: #3686d4;
}

.bg-purple {
  background-color: #6b49a9;
}

.color-bar {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
}

.truncate-container {
  white-space: nowrap;
  overflow-x: hidden;
}

.edit-label {
  z-index: 999;
}

.v-application .request-card {
  height: 108px;
  position: relative;
  padding-left: 30px;
  border: 1px solid grey;
  cursor: pointer;

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

.v-application .request-card .v-input {
  position: relative;
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
</style>
