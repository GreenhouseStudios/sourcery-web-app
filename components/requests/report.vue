<template>
    <v-dialog v-model="dialogActive" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="error">Report</v-btn>
        </template>

        <template v-slot:default>
            <v-card title="Report Messages">
                <v-card-text>
                    Reporting this communication will lock this feature and notify Sourcery support.  Are you sure you want to report this communication?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogActive = false">Cancel</v-btn>
                    <v-btn color="error" @click="report">Report</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
const props = defineProps(['request'])
const { dialogActive, report } = useRequestReport(props.request)
</script>