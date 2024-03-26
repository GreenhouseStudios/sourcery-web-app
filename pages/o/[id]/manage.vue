<template>
    <div id="page-occupation-id">
        <v-container>
            <h1>Organization</h1>
            <div>{{ organization }}</div>
        </v-container>
    </div>
</template>

<script setup>
const { organization, getOrganization } = useOrganizations()

await getOrganization()
</script>