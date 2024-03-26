<template>
    <div id="page-dashboard" class="py-4">
        <v-container>
            <template v-if="authUser">
                <h1 class="mb-4">Dashboard</h1>

                <RequestsCreateAlert v-if="userOrgs.length === 0"></RequestsCreateAlert>

                <template v-else>
                    <organization-view-alert :organization="org" v-for="org in userOrgs"></organization-view-alert>
                </template>

                <v-row>
                    <v-col md="8">
                        <requests-search ref="search"></requests-search>
                    </v-col>
                    <v-col md="4" class="d-none d-md-block">
                        <v-card @click="setStatus('Complete')" class="mb-4">
                            <v-card-title>Completed</v-card-title>
                            <v-card-text class="py-0">
                                <p>These requests are completed and ready to download assets.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ countCompleted }}</p>
                            </v-card-text>
                        </v-card>

                        <v-card @click="setStatus('Submitted')" class="mb-4">
                            <v-card-title>New Requests</v-card-title>
                            <v-card-text class="py-0">
                                <p>These requests were newly submitted, and are waiting to be picked up by an organization.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ countSubmitted }}</p>
                            </v-card-text>
                        </v-card>

                        <v-card @click="setStatus('In Progress')" class="mb-4">
                            <v-card-title>In Progress</v-card-title>
                            <v-card-text class="py-0">
                                <p>Requests that have been picked up by an organization, and are in progress.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ countInProgress }}</p>
                            </v-card-text>
                        </v-card>

                        <v-card to="/requests/unregistered" class="mb-4">
                            <v-card-title>Unregistered</v-card-title>
                            <v-card-text class="py-0">
                                <p>Requests that have been submitted to unregistered institutions.</p>
                            </v-card-text>
                            <v-card-text class="py-0">
                                <p class="text-h4">{{ requestCount }}</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <template v-else>
                <h1>Welcome to Sourcery!</h1>
                <p>We recommend that you first <NuxtLink to="/login">Login</NuxtLink> if you have an account, or <NuxtLink to="/register">Register</NuxtLink> to create one before making a request!</p>
            </template>
        </v-container>
    </div>
</template>

<script setup>
const { authUser, userOrgs } = useAuthUser()
const { requestCount, countUriRequests } = useFetchUriRequests()
const { countSubmitted, countInProgress, countCompleted, fetchRequestCount } = useRequestCount()

const search = ref(null)

function setStatus(statusName) {
    search.value.setStatus(statusName)
}

await countUriRequests()
await fetchRequestCount()
</script>