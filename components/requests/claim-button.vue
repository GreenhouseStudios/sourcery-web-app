<template>
    <v-dialog v-model="dialogActive" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" size="large" variant="tonal" color="primary">Claim Request</v-btn>
        </template>

        <v-card title="Claim Request">
            <v-card-text>
                <p>Claiming this request will assign it to you, and change the status to "In Progress".  This will also notify the requesting user of the change in status. Are you sure you want to claim this request?</p>
            </v-card-text>
            <v-card-actions>
                <v-btn text @click="dialogActive = false">Close</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="claimRequest" :disabled="claimLoading">Claim</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps(['request'])
const { dialogActive, claimRequest, claimLoading } = useClaimRequest(props.request)
</script>