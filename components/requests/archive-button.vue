<template>
    <v-dialog v-model="dialogActive" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="primary" size="large" variant="tonal">Archive</v-btn>
        </template>

        <template v-slot:default>
            <v-card title="Archive Request">
                <v-card-text>
                    Archiving this request will change the status to "Archived".  This will NOT notify the requesting user of the change in status, and the attachments and archive notes will still be available.  Messages, files, and log entries can no longer be added. Are you sure you want to archive this request?
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="dialogActive = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="tonal" @click="archiveRequest" :disabled="archiveLoading">Archive</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
const props = defineProps(['request'])
const { dialogActive, archiveRequest, archiveLoading } = useArchiveRequest(props.request)
</script>