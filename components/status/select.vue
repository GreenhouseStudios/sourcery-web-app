<template>
    <v-select
        v-model="selected"
        :items="statuses"
        label="Filter by Status"
        item-title="name"
        item-value="id"
        variant="outlined"
        multiple
        clearable
        hide-details
        placeholder="Filter by Status"
        density="compact"
    ></v-select>
</template>

<script setup>
const { statuses, fetchStatus } = useFetchStatus()

const selected = defineModel()

await fetchStatus()
</script>