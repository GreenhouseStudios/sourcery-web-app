<template>
  <div class="chat">
    <div class="text-center">
      <v-dialog v-model="reportingShowConfirm" max-width="500">
        <v-card max-width="500">
          <v-card-title>Are you sure?</v-card-title>
          <v-card-text>This action will put the request and account under review, and potentially lead to removal.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="error" @click="cancelReport">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="confirmReport">
              I understand, report
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="chat-card-viewport">
      <div v-if="open" class="chat-card-container">
        <v-card max-width="500" class="chat-card">
          <v-list-item two-line class="chat-card-title-bar">
            <v-list-item-content>
              <v-list-item-title class="text-h6 light-mode-white">
                {{ chatTitle }}
              </v-list-item-title>
              <v-list-item-subtitle class="light-mode-white">
                {{ chatSubtitle }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="nostack">
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="light-mode-white mx-2"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon dark>
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-if="!userHasReported" @click="report">
                    <v-list-item-title>{{ reportActionText }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="userHasReported">
                    <v-list-item-title>{{ reportActionText }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn icon class="light-mode-white" @click="toggleMinimize">
                <v-icon>{{ minimizeIcon }}</v-icon>
              </v-btn>
              <v-btn icon class="light-mode-white" @click="close">
                <v-icon>{{ closeIcon }}</v-icon>
              </v-btn>
            </v-list-item-action>
            <div v-if="gotNewMessages" class="badge">
              <v-icon>mdi-shimmer</v-icon>
            </div>
          </v-list-item>
          <v-card-text v-if="!hasAgreedToTerms" class="cap-height">
            <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.  By chatting with experts, you understand that you will not get an immediate response, and agree to treat experts with respect or subject your account to ban.</p>
            <v-checkbox v-model="initialMessageDoNotShowAgain" label="Do not show message again." />
            <v-btn @click="handleAgreeToTerms()">
              I agree.
            </v-btn>
          </v-card-text>
          <v-card-text v-show="!minimized && hasAgreedToTerms" id="chatScroller" class="overflow-y-scroll cap-height">
            <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.</p>
            <div class="chat-card-messages rounded">
              <div v-for="message in messages" :class="chatMessageClass(message)">
                <div :class="chatMessageTextClass(message)">
                  {{ message.content }}
                </div>
              </div>
            </div>
            <v-alert v-if="userHasReported" type="warning">
              You have reported this chat.
            </v-alert>
            <div v-if="messages.length === 0 && !vendorIsClient" class="no-messages">
              <p>There are currently no messages in this chat.  Send the first one below!  The recipient will receive an email when sent.</p>
            </div>
            <div v-if="vendorIsClient">
              <p>Client is the same user as the vendor, thus no need for chat.</p>
            </div>
          </v-card-text>
          <hr>
          <v-card-actions v-if="!minimized && !vendorIsClient" class="pt-5 px-4">
            <v-row>
              <v-col cols="10">
                <v-text-field v-model="newMessage" placeholder="Type a message here." dense filled rounded />
              </v-col>
              <v-col>
                <v-btn fab small :disabled="sendButtonDisabled" @click="sendMessage">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    data () {
        return {
            newMessage: '',
            closeIcon: 'mdi-close',
            sending: false,
            newMessageWhileSending: '',
            reportingShowConfirm: false,
            initialMessageDoNotShowAgain: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser',
            open: 'supabaseChat/isOpen',
            minimized: 'supabaseChat/isMinimized',
            request: 'supabaseChat/request',
            messages: 'supabaseChat/messages',
            organization: 'supabaseChat/organization',
            gotNewMessages: 'supabaseChat/gotNewMessages',
            hasAgreedToTerms: 'supabaseChat/hasAgreedToTerms',
            reports: 'supabaseChat/reports',
            userHasReported: 'supabaseChat/userHasReported'
        }),
        isVendor () {
            if (this.organization) {
                return this.user.id === this.organization.owner_id
            }
            return false
        },
        vendorIsClient () {
            if (this.organization && this.request.user_id === this.organization.owner_id) {
                return true
            }
            return false
        },
        minimizeIcon () {
            if (this.minimized) {
                return 'mdi-chevron-up'
            }
            return 'mdi-chevron-down'
        },
        chatTitle () {
            if (this.isVendor) {
                return 'Chat with the Client'
            }
            return 'Chat with an Archivist'
        },
        chatSubtitle () {
            if (this.request && this.request.id) {
                if (this.isVendor && this.request.request_vendor) {
                    return `Request ${this.request.id} - ${this.request.request_vendor.label}`
                } else if (!this.isVendor && this.request.request_client) {
                    return `Request ${this.request.id} - ${this.request.request_client.label}`
                }
                return `Request ${this.request.id}`
            }
            return 'Loading Request #'
        },
        sendButtonDisabled () {
            return this.newMessage === '' || this.sending
        },
        reportActionText () {
            if (this.userHasReported) {
                return 'Chat Reported'
            }
            return 'Report'
        }
    },
    watch: {
        open: {
            handler (newVal, oldVal) {
                if (newVal) {
                    setTimeout(this.scrollToBottom, 100)
                }
            },
            flush: 'post'
        }
    },
    created () {
        console.log(localStorage.DoNotShowChatMessageAgain)
        if (localStorage.DoNotShowChatMessageAgain) {
            this.initialMessageDoNotShowAgain = true
            this.agreeToTerms()
        }
    },
    methods: {
        ...mapMutations({
            clear: 'supabaseChat/clear',
            setOpen: 'supabaseChat/setOpen',
            setMinimized: 'supabaseChat/setMinimized',
            setJustGotNewMessages: 'supabaseChat/setJustGotNewMessages',
            agreeToTerms: 'supabaseChat/agreeToTerms'
        }),
        ...mapActions({
            sendChatMessage: 'supabaseChat/sendMessage',
            reportChat: 'supabaseChat/reportChat'
        }),
        toggleOpen () {
            this.setJustGotNewMessages(false)
            this.setOpen(!this.open)
        },
        toggleMinimize () {
            this.setJustGotNewMessages(false)
            this.setMinimized(!this.minimized)
        },
        chatMessageClass (message) {
            let class_string = 'chat-card-message'
            if (message.user_id === this.user.id) {
                class_string += ' alt-right'
            }
            return class_string
        },
        chatMessageTextClass (message) {
            let class_string = 'chat-card-message-text'
            if (message.user_id === this.user.id) {
                class_string += ' alt-purple'
            }
            if (this.sending) {
                class_string += ' might-be-faded'
            }
            return class_string
        },
        async sendMessage () {
            this.newMessageWhileSending = this.newMessage
            this.newMessage = ''
            this.sending = true
            this.scrollToBottom()
            await this.sendChatMessage({
                vendor: this.isVendor,
                messageText: this.newMessageWhileSending
            })
            this.sending = false
            this.newMessageWhileSending = ''
            this.scrollToBottom()
        },
        close () {
            this.clear()
        },
        scrollToBottom () {
            const scrollerElement = document.getElementById('chatScroller')
            if (scrollerElement) {
                scrollerElement.scrollTop = 9999999999
            }
        },
        handleAgreeToTerms () {
            this.agreeToTerms()
            if (this.initialMessageDoNotShowAgain) {
                localStorage.DoNotShowChatMessageAgain = true
            }
            nextTick(this.scrollToBottom)
        },
        report () {
            this.reportingShowConfirm = true
        },
        async confirmReport () {
            await this.reportChat()
            this.scrollToBottom()
            this.reportingShowConfirm = false
        },
        cancelReport () {
            this.reportingShowConfirm = false
        }
    }
}
</script>

<style lang="scss">
.chat-card-viewport {
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 99;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .chat-card-container {
        position: absolute;
        bottom: 0;
        right: 20%;
        z-index: 999999;
        pointer-events: auto;

        .chat-card {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .chat-card-title-bar {
              background: linear-gradient(45deg, #654EA3, #431A5A);
            }

            .chat-card-title {

            }

            .cap-height {
              max-height: 350px;
            }

            .overflow-y-scroll {
              overflow-y: auto;
            }

            .chat-card-message {
              margin-bottom: 15px;
              display: block;
              display: flex;
              justify-content: flex-start;
              &.alt-right {
                justify-content: flex-end;
              }
              &.rounded {
                .chat-card-message-text {
                  border-radius: 15px;
                }
              }
                .chat-card-message-text {
                background-color: #555455;
                color: white;
                padding: 10px 15px;
                max-width: 70%;
                justify-self: left;
                border-radius: 2px;
                &.alt-purple {
                  background-color: #654EA3;
                  text-align: right;
                }
                &.might-be-faded:last-child {
                  opacity: 0.8;
                }
              }
            }

        }
    }
}
</style>

<style lang="scss" scoped>
.theme--light {
  .light-mode-white {
    color: white!important;
  }
}

.nostack {
  flex-direction: row;
}

hr {
  border-color: rgba(112, 112, 112, .62)
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: red;
  width: 20px;
  height: 20px;
  border-radius: 24px;

  i.v-icon {
    display: flex;
    width: 12px;
    height: 12px;
    font-size: 14px;
    margin: 4px;
    align-self: center;
    justify-self: center;
  }
}

</style>
