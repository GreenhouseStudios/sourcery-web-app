<template>
    <v-alert border="start" v-show="requestCount > 0" class="mb-4">You have {{ requestCount }} requests with unregistered organizations. You can <NuxtLink to="/requests/unregistered">view those here</NuxtLink>.</v-alert>
</template>

<script setup>
const { requestCount, countUriRequests } = useFetchUriRequests()

await countUriRequests()
</script>