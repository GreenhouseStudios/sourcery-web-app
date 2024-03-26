<template>
    <v-dialog v-model="dialogActive" max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" size="large" variant="tonal" color="success">Complete Request</v-btn>
        </template>

        <v-card title="Complete Request">
            <v-card-text>
                <p>Completing this request will change the status to "Completed".  This will notify the requesting user of the change in status, and the attachments and archive notes will become available.  Messages, files, and log entries can still be added. Are you sure you want to complete this request?</p>
            </v-card-text>
            <v-card-actions>
                <v-btn text @click="dialogActive = false">Close</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="completeRequest" :disabled="completeLoading">Complete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps(['request'])
const { dialogActive, completeRequest, completeLoading } = useCompleteRequest(props.request)
</script>