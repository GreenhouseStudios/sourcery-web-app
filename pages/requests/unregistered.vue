<template>
    <div id="page-requests-unregistered">
        <v-container>
            <h1 class="mb-4">Unregistered Requests</h1>
            <p>These requests were submitted to a location not yet registered with Sourcery. Not to worry - we're reaching out for you, but a response is not guaranteed.</p>

            {{ requests }}
        </v-container>
    </div>
</template>

<script setup>
const { requests, fetchUserUriRequests } = useFetchUriRequests()

await fetchUserUriRequests()
</script>