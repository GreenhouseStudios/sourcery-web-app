<template>
    <div id="page-admin">
        <v-container class="py-5">
            <h1>System Administration</h1>
            <p>Only accessible by system administrators and developers.</p>

            <v-row>
                <v-col cols="12" md="4">
                    <v-card title="View Organizations" to="/o">
                        <v-card-text>
                            View and manage organizations and their associated repositories.
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card title="Non-Partner Institution Requests" to="/admin/npi">
                        <v-card-text>
                            See all pending Non-Partner Institution requests in the system, and choose to delete or resolve them.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['admin']
})
</script>