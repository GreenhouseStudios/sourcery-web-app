<template>
    <div id="page-organizations">
        <v-container>
            <v-row justify="center" align="center">
                <v-col md="6">
                    <h1 class="mb-6">Organizations</h1>
                    <v-list>
                        <v-list-item v-for="organization in organizations">
                            <template v-slot:title>
                                <div class="text-h6">{{ organization.name }}</div>
                            </template>
                            <template v-slot:subtitle>
                                <div>{{ organization.address }}</div>
                            </template>
                            <template v-slot:append>
                                <v-btn variant="text" color="primary" :to="`/o/${organization.id}`">View</v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['admin']
})

const { organizations, getOrganizations } = useOrganizations()

await getOrganizations()
</script>