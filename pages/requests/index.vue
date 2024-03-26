<template>
    <div id="page-requests">
        <v-container>
            <h1 class="mb-4">Search Requests</h1>
            <p>Here you can search over any requests you have placed.  To see requests that you have placed to unregistered institutions, visit the <NuxtLink to="/requests/unregistered">unregistered request search</NuxtLink>.</p>
            <v-text-field label="Search" variant="outlined" v-model="search" @update:model-value="onModelChange">
                <template v-slot:loader>
                    <v-progress-linear :active="loading" color="primary" height="7" indeterminate></v-progress-linear>
                </template>
            </v-text-field>

            <v-row>
                <v-col>
                    <StatusSelect v-model="selectedStatus" @update:model-value="onModelChange"></StatusSelect>
                </v-col>
                <v-col>
                    <v-select v-model="order" :items="orderOptions" variant="outlined" clearable placeholder="Sort Order" label="Sort Order" @update:model-value="onModelChange" density="compact"></v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col md="6" class="mb-2" v-for="request in requests">
                    <RequestListItem :request="request"></RequestListItem>
                </v-col>
            </v-row>
            
        </v-container>
        
    </div>
</template>

<script setup>
const {
    requests,
    search,
    selectedStatus,
    order,
    loading,
    fetchRequests,
    onModelChange
} = useRequestSearch()

const orderOptions = ref([
    { title: 'Newest First', value: 'newest' },
    { title: 'Oldest First', value: 'oldest' }
])

await fetchRequests()
</script>