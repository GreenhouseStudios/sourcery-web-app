<template>
  <div class="chat-list">
    <p v-if="loading">
      Loading...
    </p>
    <div v-for="chat in chatMessages" :class="messageListItemClass(chat)">
      <strong>{{ messageFrom(chat) }}:</strong> <span>{{ chat.content }}</span>
    </div>
    <p v-if="!chatMessages.length && !loading">
      No chat messages in this request.
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { RequestComment } from '~/models/RequestComment'

export default {
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            chatMessages: [],
            loading: true
        }
    },
    async fetch () {
        this.chatMessages = await RequestComment.getForRequest(this.request)
        this.loading = false
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        isClient () {
            return this.user.id === this.request.user_id
        }
    },
    methods: {
        messageFrom (message) {
            if (message.user_id === this.user.id) {
                return 'Me'
            }

            if (this.isClient) {
                return 'Vendor'
            }
            return 'Client'
        },
        messageListItemClass (message) {
            let classes = 'chat-list-item'
            if (message.user_id === this.user.id) {
                classes += ' user-message'
            }
            return classes
        }
    }
}
</script>

<style lang="scss">
.chat-list {
    max-height: 200px;
    margin-top: 10px;
    overflow-y: auto;
}

.chat-list-item {
    padding: 5px 10px;
    &.user-message {
        background-color: rgba(255,255,255, 10%);
    }
}

@media print {
    .chat-list {
        overflow: initial !important;
    }
}
</style>
