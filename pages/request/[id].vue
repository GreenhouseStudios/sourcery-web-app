<template>
    <div id="page-request-id" class="py-5">
        <v-container>
            <h1 class="mb-6">Request Summary</h1>
            <v-row class="mb-5">
                <v-col cols="12" md="8">
                    <v-sheet color="surface" elevation="4" rounded class="pa-5 fill-height">
                        <v-row>
                            <v-col cols="12" md="3"><h3>Request ID</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.id }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Title</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ requestLabel }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Citation</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.citation }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Requested By</h3></v-col>
                            <v-col cols="12" md="9">
                                <p class="mb-0">{{ request.user.name }}</p>
                                <p class="mb-0">{{ request.user.email }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Requested To</h3></v-col>
                            <v-col cols="12" md="9">
                                <p class="mb-0"><strong>{{ request.repository.name }} - {{ request.repository.organization.name }}</strong></p>
                                <p class="mb-0">{{ request.repository.address1 }}</p>
                                <p class="mb-0">{{ request.repository.address2 }}</p>
                                <p class="mb-0">{{ request.repository.city }}, {{ request.repository.state }} {{ request.repository.zip }} {{ request.repository.country_code }}</p>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
                <v-col cols="12" md="4">
                    <requests-progress-panel :request="request"></requests-progress-panel>
                </v-col>
            </v-row>

            <template v-if="!isSubmitted">
                <v-expansion-panels model-value="attachments" class="mb-6">
                    <v-expansion-panel :title="`Attachments (${request.attachments.length})`" value="attachments">
                        <v-expansion-panel-text class="py-4">
                            <requests-file-manager :request="request" v-if="canService || isCompleted || isArchived"></requests-file-manager>
                            <p class="mb-0" v-else-if="isInProgress">The vendor is working on this request - check back later for attachments.</p>
                            <p class="mb-0" v-else>Nothing here yet.</p>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>


                <v-expansion-panels class="mb-6">
                    <v-expansion-panel value="messages" @click="clearUnread">
                        <v-expansion-panel-title class="position-relative">
                            <v-badge color="error" floating dot v-if="hasUnread">Messages</v-badge>
                            <span v-else>Messages</span>
                            <v-chip v-if="isReported" color="error" class="ms-4">Reported</v-chip>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="py-4">
                            <requests-messenger :request="request" v-model="messengerAlertAgree"></requests-messenger>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="mb-6" v-if="canService">
                    <v-expansion-panel value="eventLog">
                        <v-expansion-panel-title>Event History</v-expansion-panel-title>
                        <v-expansion-panel-text class="py-4">
                            <p>The event log is only viewable by users who have permission to service this request.</p>
                            <requests-event-log :request="request"></requests-event-log>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="mb-6">
                    <v-expansion-panel value="archiveNotes">
                        <v-expansion-panel-title>Additional Notes &amp; Citations</v-expansion-panel-title>
                        <v-expansion-panel-text class="py-4">
                            <p v-if="!canService && isInProgress">Additional notes and citations provided by the servicing provider will be displayed here when completed.</p>
                            <p v-if="canService">This section gives an opportunity to fulfill a request via description, links, or other, as well as provide a corrected or suggested citation for the documents requested.  Requesting users will see this information once the request is considered "Complete".</p>
                            <requests-edit-archive-notes :request="request" v-if="canService && !isArchived && !isCancelled"></requests-edit-archive-notes>
                            <v-container v-if="isArchived || isCancelled || (!canService && isCompleted)">
                                <v-row>
                                    <v-col cols="12" md="3"><h3>Fulfillment Notes</h3></v-col>
                                    <v-col cols="12" md="9"><p class="mb-0">{{ request.archive_notes ?? 'None Provided' }}</p></v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="3"><h3>Suggested Citation</h3></v-col>
                                    <v-col cols="12" md="9"><p class="mb-0">{{ request.archive_citation ?? 'None Provided' }}</p></v-col>
                                </v-row>
                            </v-container>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </template>

            <v-card title="Pending Actions" class="pa-2">
                <v-card-text v-if="isSubmitted">
                    <v-divider class="mb-4"></v-divider>
                    <template v-if="canService">
                        <p>This request requires action by your institution.  Claiming the request will notify the requesting user and move the status to "In-Progress".</p>
                        <requests-claim-button :request="request" v-if="canService"></requests-claim-button>
                    </template>
                    <v-alert v-else type="info" class="mb-0">Your request has been submitted and is awaiting review.</v-alert>
                </v-card-text>
                <v-card-text v-if="isSubmitted || isInProgress">
                    <v-divider class="mb-4"></v-divider>
                    <p v-if="canService">Is this request not serviceable by your insitution, or contain spam/harmful content? In any similar case, a request can be cancelled.  This will notify the requesting user as well.</p>
                    <p v-else>A request can be cancelled at any time.  This will make the request unserviceable, and change the status to "Cancelled".</p>
                    <requests-cancel-button :request="request"></requests-cancel-button>
                </v-card-text>
                <v-card-text v-if="isInProgress && canService">
                    <v-divider class="mb-4"></v-divider>
                    <p>When ready, this request can be marked as completed.</p>
                    <requests-complete-button :request="request"></requests-complete-button>
                </v-card-text>
                <v-card-text v-if="isCompleted">
                    <v-divider class="mb-4"></v-divider>
                    <template v-if="canService">
                        <p>This request has been completed.  Sourcery provides an option to archive requests, which will prevent changes and signal to us that documents can be moved to cold storage (they are still available for download).</p>
                        <requests-archive-button :request="request"></requests-archive-button>
                    </template>
                    <v-alert v-else type="success" class="mb-0">This request has been completed and is available for download.</v-alert>
                </v-card-text>
                <v-card-text v-if="isArchived">
                    <p>This request has been archived.  No further actions will be available.</p>
                </v-card-text>
                <v-card-text v-if="isCancelled">
                    <p>This request has been cancelled. No further actions will be available.</p>
                </v-card-text>
            </v-card>

            <div class="my-6" v-if="config.public.SOURCERY_ENV === 'local'">
                <pre>{{ request }}</pre>
            </div>
        </v-container>
    </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { 
    request, requestLabel,
    isSubmitted, isInProgress, isCompleted, isArchived, isReported, isCancelled,
    canService,
    fetchRequest
} = useFetchRequest()

await fetchRequest()

const { hasUnread, clearUnread } = useRequestMessenger(request.value)

const messengerAlertAgree = ref(true)
</script>