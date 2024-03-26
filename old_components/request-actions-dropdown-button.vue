<template>
  <v-menu offset-y>
    <template #activator="{ on: { click }, attrs }">
      <v-btn
        class="mx-2 px-4"
        style="z-index:1"
        v-bind="attrs"
        color="primary"
        @click.stop.prevent="click"
      >
        Request Actions <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="item in requestActionsList"
        @click.prevent="item.action"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { Request } from '~/models/Request'

export default {
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            authUser: 'supabaseAuth/authUser',
            userRepositories: 'supabaseAuth/userRepositories'
        }),
        shouldShowChat () {
            return true
        },
        shouldShowLabelEdit () {
            return true
        },
        shouldShowCancel () {
            const isSubmitted = Request.isSubmitted(this.request)
            const isOwner = Request.isOwner(this.authUser.id, this.request)
            const canManage = Request.canManage(this.userRepositories, this.request)
            return isSubmitted && (isOwner || canManage)
        },
        shouldShowArchive () {
            const isComplete = Request.isComplete(this.request)
            const isCancelled = Request.isCancelled(this.request)
            const isArchived = Request.isArchived(this.request)
            return (isComplete || isCancelled) && !isArchived
        },
        requestActionsList () {
            const list = []

            if (this.shouldShowLabelEdit) {
                list.push({
                    name: 'Edit Label',
                    action: this.editLabel
                })
            }

            if (this.shouldShowChat) {
                list.push({
                    name: 'Open Chat',
                    action: this.openChat
                })
            }

            if (this.shouldShowArchive) {
                list.push({
                    name: 'Archive Request',
                    action: this.archiveRequest
                })
            }

            if (this.shouldShowCancel) {
                list.push({
                    name: 'Cancel Request',
                    action: this.cancelRequest
                })
            }

            return list
        }
    },
    methods: {
        openChat () {
            this.$emit('requestActionsDispatch', 'openChat')
        },
        editLabel () {
            this.$emit('requestActionsDispatch', 'editLabel')
        },
        cancelRequest () {
            this.$emit('requestActionsDispatch', 'cancelRequest')
        },
        archiveRequest () {
            this.$emit('requestActionsDispatch', 'archiveRequest')
        }
    }
}
</script>
