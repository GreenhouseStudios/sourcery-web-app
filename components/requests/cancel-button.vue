<template>
    <v-dialog v-model="dialogActive" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" size="large" variant="tonal" color="error">Cancel Request</v-btn>
        </template>

        <template v-slot:default>
            <v-card title="Cancel Request">
                <v-card-text>
                    <v-alert type="error" variant="tonal" class="mb-4">Please Read Carefully - this action cannot be undone.</v-alert>
                    <p>Cancelling this request will render it unserviceable, and change the status to "Cancelled".  Any assets uploaded to this request will be considered disposable.  Are you sure you want to cancel this request?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogActive = false">Close</v-btn>
                    <v-btn color="error" @click="cancelRequest" :disabled="cancelLoading">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
const props = defineProps(['request'])
const { dialogActive, cancelRequest, cancelLoading } = useCancelRequest(props.request)
</script>