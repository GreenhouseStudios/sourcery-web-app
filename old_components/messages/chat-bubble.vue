<template>
  <div class="mb-3">
    <div v-if="showDate">
      <div class="d-flex justify-content-end">
        <div class="chat-card-message-time">
          <em>{{ message.created_at | normalDate }}</em>
        </div>
      </div>
      <hr class="mb-4">
    </div>
    <div :class="chatMessageClass">
      <div v-if="!isUser" class="pa-3 rounded-circle user-bubble">
        <v-icon dark>
          mdi-account-supervisor
        </v-icon>
      </div>
      <div :class="chatMessageTextClass">
        {{ message.content }}
      </div>
      <div v-if="isUser" class="pa-3 rounded-circle user-bubble">
        <v-icon dark>
          mdi-account
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        message: {
            type: Object,
            default: () => { }
        },
        userId: {
            type: String,
            default: ''
        },
        showDate: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        isUser () {
            return this.message.user_id === this.userId
        },
        chatMessageClass () {
            let class_string = 'chat-card-message mb-0'
            if (this.isUser) {
                class_string += ' alt-right'
            }
            return class_string
        },
        chatMessageTextClass () {
            let class_string = 'chat-card-message-text'
            if (this.isUser) {
                class_string += ' alt-purple'
            }
            if (this.sending) {
                class_string += ' might-be-faded'
            }
            return class_string
        },
        senderInitials () {
            return 'KB'
        }
    }
}
</script>

<style>
.border-top {
    border-top: 1px solid darkgrey;
}
</style>
