<template>
    <v-container>
        <div class="mb-4">
            <template v-for="req_event in request.request_events">
                <v-row class="py-2">
                    <v-col cols="12" md="4"><em>{{ $filters.normalDate(req_event.created_at) }}</em></v-col>
                    <v-col cols="12" md="8">{{ getEventDescription(req_event) }}</v-col>
                </v-row>
                <v-divider></v-divider>
            </template>
        </div>

        <v-dialog v-model="newLogDialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn prepend-icon="mdi-plus" color="primary" v-bind="activatorProps" :disabled="newLogMessageLoading" v-if="!isArchived && !isCancelled">Add Log Entry</v-btn>
            </template>
            <template v-slot:default>
                <v-form @submit.prevent="addMessage" v-model="newLogMessageValid" :disabled="newLogMessageLoading">
                    
                    <v-card title="Add Event Log Entry">
                        <v-card-text>
                            <p class="mb-0">The following wildcards are supported:</p>
                            <v-list density="compact" class="mb-2 text-caption">
                                <v-list-item><strong>{{ '%u' }}</strong> - Your name</v-list-item>
                                <v-list-item><strong>{{ '%s' }}</strong> - The request current status</v-list-item>
                            </v-list>
                            <v-textarea
                                v-model="newLogMessage"
                                :loading="newLogMessageLoading"
                                :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount1000]"
                                :counter="1000"
                                label="Description"
                                outlined
                                rows="5"
                            ></v-textarea>
                            <v-alert color="error" icon="$error" v-if="newLogMessageError">{{ newLogMessageError }}</v-alert>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="newLogDialog = false">Cancel</v-btn>
                            <v-btn color="primary" type="submit">Add Log Entry</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </template>
        </v-dialog>
        
    </v-container>
</template>

<script setup>
const props = defineProps(['request'])

const {
    newLogDialog,
    newLogMessage,
    newLogMessageValid,
    newLogMessageLoading,
    newLogMessageError,
    addMessage,
    getEventDescription
} = useEventLog(props.request)

const { isCompleted, isCancelled, isArchived } = useFetchRequest(props.request)
</script>