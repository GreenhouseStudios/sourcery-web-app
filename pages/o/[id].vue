<template>
    <div id="page-occupation-id" class="py-6">
        <v-container>
            <h1 class="mb-4">{{ organization.name }}</h1>

            <v-row class="mb-4">
                <v-col cols="12" md="4">
                    <v-card @click="setStatus('Submitted')" class="mb-4 fill-height">
                        <v-card-title>New Requests</v-card-title>
                        <v-card-text class="py-0">
                            <p>These requests were newly submitted, and are waiting to be picked up by your organization.</p>
                        </v-card-text>
                        <v-card-text class="py-0">
                            <p class="text-h4">{{ countSubmitted }}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card @click="setStatus('In Progress')" class="mb-4 fill-height">
                        <v-card-title>In Progress</v-card-title>
                        <v-card-text class="py-0">
                            <p>Requests that have been picked up by your organization, and are currently being serviced.</p>
                        </v-card-text>
                        <v-card-text class="py-0">
                            <p class="text-h4">{{ countInProgress }}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card @click="setStatus('Complete')" class="mb-4 fill-height">
                        <v-card-title>Completed</v-card-title>
                        <v-card-text class="py-0">
                            <p>These requests are recently completed and ready to be archived.</p>
                        </v-card-text>
                        <v-card-text class="py-0">
                            <p class="text-h4">{{ countCompleted }}</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <requests-search ref="search" :organization-id="organization.id"></requests-search>
        </v-container>
    </div>
</template>

<script setup>
const route = useRoute()
const { organization, getOrganization } = useOrganizations()
const { organization: countOrganization, countSubmitted, countInProgress, countCompleted, fetchRequestCount } = useRequestCount()

const search = ref(null)

function setStatus(statusName) {
    search.value.setStatus(statusName)
}

await getOrganization(route.params.id)

countOrganization.value = organization.value
await fetchRequestCount()
</script>