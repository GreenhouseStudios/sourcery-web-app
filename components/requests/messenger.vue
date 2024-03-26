<template>
    <div class="request-messenger">
        <v-alert title="Keep it Civil!" type="warning" variant="tonal" class="mb-3" v-if="civilAlert && !isReported && !isCancelled && !isArchived && !isCompleted">
            <p>Remember, there are real, hard working people behind the scenes.  This chat is not a 24/7, highly available chat, but rather a convenient channel for communication when fulfillment experts become available.  By messaging with experts, you understand that you will not get an immediate response, and agree to treat experts with respect or subject your account to ban.</p>

            <v-btn variant="text" color="warning" @click="civilAlert = false">I agree</v-btn>
        </v-alert>
        
        <div class="messenger-scroller position-relative mb-3" :class="{
            'messenger-scroller position-relative mb-3': true,
            'disabled': isReported
        }">
            <v-row v-for="message in messages" no-gutters class="request-message mb-4">
                <v-col>
                    <v-sheet :class="{
                        'request-message-sheet py-3 px-5 d-inline-block': true,
                        'float-right': messageIsMine(message)
                    }" rounded="lg" elevation="1" :color="messageIsMine(message) ? 'primary' : 'surface-light'" width="auto">
                        <p class="text-caption mb-1"><em>{{ $filters.normalDate(message.created_at) }}</em></p>
                        {{ message.content }}
                    </v-sheet>
                </v-col>
            </v-row>
            <p v-if="messages.length === 0">There are no messages here yet.</p>
        </div>

        <v-form
            class="new-message-form"
            @submit.prevent="sendMessage"
            v-model="messageFormValid"
            validate-on="submit"
            :disabled="messageFormLoading"
            v-if="!isReported && !isArchived && !isCancelled">
            <v-textarea
                v-model="message"
                label="New Message"
                placeholder="Type your message here..."
                variant="outlined"
                rows="3"
                class="mb-3"
                :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]"
                counter="6000"
            ></v-textarea>

            <div class="d-flex">
                <v-btn color="primary" type="submit" :disabled="messageFormLoading">Send</v-btn>
                <v-spacer></v-spacer>
                <requests-report :request="request" v-if="canService && !isArchived && !isCancelled"></requests-report>
            </div>
            
        </v-form>

        <v-alert title="Reported" type="error" variant="tonal" class="mb-3" v-if="isReported">This chat has been reported.  If you believe this is an error, please contact <NuxtLink to="/feedback">Sourcery support</NuxtLink>.</v-alert>
    </div>
</template>

<script setup>
const props = defineProps(['request'])
const {
    messageFormValid, messageFormLoading, messageFormError, message,
    messages, getMessages, sendMessage
} = useRequestMessenger(props.request)
const civilAlert = defineModel({ type: Boolean, default: true })
const { authUser } = useAuthUser()
const { isReported, canService, isArchived, isCancelled, isCompleted } = useFetchRequest(props.request)

function messageIsMine(message) {
    return message.user_id === authUser.value.id || (message.vendor && canService.value)
}

await getMessages()
</script>

<style lang="scss" scoped>
.messenger-scroller {
    max-height: 50vh;
    overflow-y: auto;
    &.disabled {
        // pointer-events: none;
        opacity: 0.5;
        max-height: 30vh;
    }
    .request-message {
        .request-message-sheet {
            max-width: 80%;
            width: auto;
        }
    }
}
</style>