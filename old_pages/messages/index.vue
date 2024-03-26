<template>
  <div class="messages-page w-100 h-md-100 px-2">
    <v-row class="h-md-100 mxh-85v align-stretch pos-r">
      <v-col v-if="$vuetify.breakpoint.mobile">
        <v-toolbar class="grey-bg" @click="messagesOpen = !messagesOpen">
          <v-toolbar-title>Messages</v-toolbar-title>
          <v-spacer />
          <v-btn fab icon>
            <v-icon dark v-html="messagesOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </v-btn>
        </v-toolbar>
        <v-card
          v-show="messagesOpen"
          flat
          tile
          height="200"
          style="overflow-y:scroll;"
          class="card-with-action"
        >
          <messages-chat-list-item
            v-for="chat in requests"
            :chat="chat"
            @selected-chat="chatSelected"
          />
        </v-card>
      </v-col>
      <v-col v-else cols="12" md="4" class="h-md-100">
        <v-card flat tile class="h-100 rounded-lg card-with-action">
          <div class="d-flex justify-space-between align-center flex-no-wrap">
            <v-card-title>Messages</v-card-title>
            <v-btn
              v-show="createEnabled"
              fab
              icon
              dark
              color="primary"
              @click="createChat"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </div>
          <messages-chat-list-item
            v-for="chat in requests"
            :chat="chat"
            @selected-chat="chatSelected"
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="8" class="d-flex flex-column h-md-100">
        <v-card v-if="!$vuetify.breakpoint.mobile || selectedChat !== null" flat tile class="mb-6 rounded-lg flex-grow-2 card-with-action">
          <div v-if="!loading" class="d-flex justify-space-between align-center flex-no-wrap">
            <div>
              <v-card-title class="text-h4 font-weight-bold pb-1">
                {{ chatTitleName }}
              </v-card-title>
              <v-card-text class="text-uppercase">
                <span>{{ chatSubtitleText }}</span><br>
                <span v-show="chatMetaText">Request Created {{ chatMetaText | normalDate }}</span>
              </v-card-text>
            </div>
            <div>
              <v-card-actions>
                <v-btn
                  v-show="selectedChat !== null"
                  outlined
                  :color="$vuetify.theme.dark ? 'white' : 'primary'"
                  class="px-4 py-2 mr-2"
                  :to="viewRequestAction"
                >
                  View Request
                </v-btn>
              </v-card-actions>
            </div>
          </div>
          <v-skeleton-loader v-if="loading" elevation="2" type="article" />
        </v-card>
        <v-card flat tile class="rounded-lg 4 mh-0 pos-r flex-grow-1">
          <v-card-text class="d-flex flex-column h-100 justify-end">
            <p v-if="!selectedChat && !loading" class="text-h6">
              Select a chat to view messages.
            </p>
            <v-skeleton-loader
              v-if="loading"
              elevation="2"
              type="list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
            />
            <div ref="messagesContainer" class="chat-card-messages overflow-y-auto px-4 mh-0">
              <messages-chat-bubble
                v-for="(message, i) in messages"
                :user-id="user.id"
                :message="message"
                :show-date="messages[i - 1] ? $options.filters.normalDate(messages[i + 1]?.created_at) !== $options.filters.normalDate(message.created_at) : true"
              />
            </div>
            <div v-show="selectedChat" class="chat-form mt-4">
              <v-form ref="chatForm" v-model="newChatTextForm" lazy-validation>
                <v-textarea
                  v-model="newChatText"
                  :counter="500"
                  :rules="[v => !!v || 'Message is required']"
                  label="Message"
                  required
                  outlined
                  rows="1"
                  class="mb-2"
                  validate-on-blur
                  @blur="() => $refs.chatForm.resetValidation()"
                />

                <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.</p>

                <v-btn color="primary" class="px-4 py-2" :disabled="loadingSend" @click="sendMessage">
                  Send
                </v-btn>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'
import { RequestComment } from '~/models/RequestComment'
import { Repository } from '~/models/Repository'

export default {
    async asyncData ({ redirect }) {
        const requests = await Request.getRequestsWithMessages()
        if (requests.length === 0) {
            redirect('/messages/select-request')
        }
        const repositories = [
            ...await Repository.getActive(),
            ...await Repository.getGhost()
        ]
        requests.forEach((request) => {
            request.repository = repositories.find((repo) => {
                return repo.id === request.request.repository_id
            })
        })
        return {
            requests
        }
    },
    data () {
        return {
            requests: [],
            selectedChat: null,
            loading: false,
            loadingSend: false,
            newChatTextForm: null,
            newChatText: '',
            createEnabled: false,
            messagesOpen: true
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        chatTitleName () {
            if (this.selectedChat) {
                if (this.isVendor) {
                    return this.selectedChat.request_vendor.label
                } else {
                    return this.selectedChat.request_client.label
                }
            }
            return 'Select Chat'
        },
        chatSubtitleText () {
            if (this.selectedChat) {
                return this.selectedChat.repository?.name
            }
            return ''
        },
        chatMetaText () {
            if (this.selectedChat) {
                return this.selectedChat.request.created_at
            }
            return ''
        },
        viewRequestAction () {
            if (this.selectedChat) {
                return '/request/' + this.selectedChat.request.id
            }
            return '#'
        },
        isVendor () {
            if (this.selectedChat) {
                return this.selectedChat.repository?.organization?.owner_id === this.user.id
            }
            return false
        },
        isOwner () {
            if (this.selectedChat) {
                return this.selectedChat.request.user_id === this.user.id
            }
            return false
        },
        messages () {
            const c = this.selectedChat?.comments ? [...this.selectedChat.comments] : []
            c.reverse()
            if (c.length > 0) {
                // Mock tests
                // Array.from({ length: 20 }, (_, i) => i + 1).forEach((i) => {
                //     c.push({
                //         id: i,
                //         request_id: 1,
                //         user_id: 1,
                //         content: 'This is a test message',
                //         created_at: '2021-01-01 00:00:00'
                //     })
                // })
                this.$nextTick(() => {
                    this.scrollToBottom()
                })
            }

            return c
        }
    },
    methods: {
        chatSelected (chat) {
            console.log('chat selected!')
            chat.comments = []
            this.loading = true
            if (this.selectedChat && this.selectedChat.request.id === chat.request.id) {
                this.loading = false
                return
            }
            this.selectedChat = null
            RequestComment.getForRequest(chat.request).then((comments) => {
                console.log('requested!')
                const newSelected = chat
                newSelected.comments = comments
                this.selectedChat = newSelected
                this.loading = false
                if (this.isVendor) {
                    this.selectedChat.request_vendor.has_unread = false
                }
                if (this.isOwner) {
                    this.selectedChat.request_client.has_unread = false
                }
                this.messagesOpen = false
            })
        },
        resetSelectedChat () {
            this.selectedChat = null
        },
        createChat () {
            this.resetSelectedChat()
            this.$router.push('/messages/select-request')
        },
        scrollToBottom () {
            this.$refs.messagesContainer.scrollTop = 9999999999
        },
        async sendMessage () {
            if (!this.$refs.chatForm.validate()) {
                return
            }
            this.loadingSend = true
            console.log('sending', this.newChatText, this.newChatTextForm)
            const newComment = new RequestComment({
                request_id: this.selectedChat.request.id,
                user_id: this.user.id,
                content: this.newChatText,
                vendor: this.isVendor
            })
            const c = await newComment.insert()
            if (!c) {
                console.log('Error posting comment')
                this.loadingSend = false
                this.$toast.error('Error sending chat message.')
                return
            }

            const sc = Object.assign({}, this.selectedChat)
            sc.comments.unshift(c)
            this.selectedChat = sc
            const ind = this.requests.findIndex(r => r.request.id === this.selectedChat.request.id)
            if (ind !== -1) {
                this.requests[ind].last_comment = c
            }
            this.loadingSend = false
            this.newChatText = ''
        }
    }
}
</script>

<style lang="scss">
@use "@/assets/src/scss/vuetify-settings" as settings;

@media #{map-get(settings.$display-breakpoints, 'md-and-up')} {
  .h-md-100 {
    height: 100%;
  }
  .mxh-85v {
    max-height: 85vh;
  }
}

.chat-card-messages {
  max-height: 70vh;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.mh-0 {
  min-height: 0;
}

.pos-r {
  position: relative;
}

</style>
