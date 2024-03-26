<template>
    <div>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field label="Search" variant="outlined" v-model="search" @update:model-value="onModelChange" density="compact" prepend-inner-icon="mdi-magnify" hide-details></v-text-field>
            </v-col>
            <v-col md="4">
                <StatusSelect v-model="selectedStatus" @update:model-value="onModelChange"></StatusSelect>
            </v-col>
            <v-col md="4">
                <v-select v-model="order" :items="orderOptions" variant="outlined" clearable placeholder="Sort Order" label="Sort Order" @update:model-value="onModelChange" density="compact" hide-details></v-select>
            </v-col>
            <v-col cols="12">
                <v-progress-linear :active="loading" color="primary" height="10" indeterminate class="mb-4"></v-progress-linear>
            </v-col>
        </v-row>

        <v-sheet v-for="request in requests" elevation="1" class="bg-surface-variant mb-6 py-4 px-6">
            <v-row justify="start" align="center" class="mb-4">
                <v-col cols="12" md="auto">
                    <StatusChip :status="request.status"></StatusChip>
                </v-col>
                <v-col cols="12" md="auto">
                    <span class="text-body-2 d-block">{{ request.repository.name }} - {{ request.repository.organization.name }}</span>
                    <span class="text-body-2 d-block text-muted"><em>Created: {{ $filters.normalDate(request.created_at) }}, Last Updated: {{ $filters.normalDate(request.updated_at) }}</em></span>
                </v-col>
            </v-row>
            <h3>{{ request.request_vendor?.label ?? request.request_client?.label ?? request.original_title ?? 'Untitled' }}</h3>
            <p>{{ request.citation }}</p>
            <v-divider class="mb-4"></v-divider>
            <div class="d-flex align-center justify-start">
                <v-btn color="primary" variant="text" border="0" :to="`/request/${request.id}`" class="mb-2 me-2">View Request</v-btn>
                <v-btn color="primary" variant="text" border="0" class="mb-2">Open Discussion</v-btn>
            </div>
        </v-sheet>

        <div v-if="requests.length === 0">
            <div v-if="hasQuery">
                <p>No requests found for your search.</p>
            </div>
            <div v-else>
                <p>No requests here.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const { findByName, fetchStatus } = useFetchStatus()
const { requests, organizationId, owned, search, selectedStatus, order, loading, orderOptions, hasQuery, fetchRequests, onModelChange } = useRequestSearch()

const props = defineProps({
    organizationId: {
        type: Number,
        default: null
    }
})

// Required so parent can call this
defineExpose({
    setStatus
})

function setStatus(statusName) {
    selectedStatus.value = [findByName(statusName).id]
    onModelChange()
}

if ( props.organizationId ) {
    organizationId.value = props.organizationId
    owned.value = false
}

await fetchStatus()
await fetchRequests()
</script>