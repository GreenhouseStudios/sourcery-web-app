<template>
  <v-list-item three-line class="borders-y rounded-0 py-2" @click="selectedChat">
    <div v-if="isUnread" class="d-flex flex-column align-self-stretch">
      <div class="pa-1_5 d-inline-block rounded-circle mr-2 mt-5" />
    </div>
    <v-list-item-content>
      <v-list-item-title class="text-truncate text-h6 text-bold">
        {{ chat.request.id }}: {{ chat.request.citation }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-truncate d-block">
        {{ chat.last_comment.content }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="text-right font-italic">
        Last Message {{ chat.last_comment.created_at | normalDate }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'
import { RequestClient } from '~/models/RequestClient'
import { RequestVendor } from '~/models/RequestVendor'

export default {
    props: {
        chat: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        ...mapGetters({
            user: 'supabaseAuth/authUser'
        }),
        isOwner () {
            return this.chat.request.user_id === this.user.id
        },
        isUnread () {
            if (this.isOwner) {
                return this.chat.request_client.has_unread
            } else {
                return this.chat.request_vendor.has_unread
            }
        }
    },
    methods: {
        selectedChat () {
            this.$emit('selected-chat', this.chat)
            if (this.isOwner) {
                RequestClient.updateUnreadById(this.chat.request.id, false)
            } else {
                RequestVendor.updateUnreadById(this.chat.request.id, false)
            }
        }
    }
}
</script>

<style scoped>
.pa-1_5 {
  padding: 6px;
}

.rounded-circle {
  background-color: #FC00D7;
}

.h-100 {
  height: 100%;
}

.borders-y {
  border-top: 1px solid rgba(72, 72, 72, 0.53);
  border-bottom: 1px solid rgba(72, 72, 72, 0.53);
}
</style>
