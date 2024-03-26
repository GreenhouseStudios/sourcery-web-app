<template>
    <v-autocomplete variant="outlined" label="Search for or Enter New Repository" v-model="repository" :items="repositories" item-title="name" return-object clearable :rules="[$sourceryForms.rules.required]" class="mb-2">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.organization.name" :subtitle="item.raw.name"></v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup>
const repository = defineModel()
const { repositories, fetchRepositories } = useFetchRepositories()

await fetchRepositories()
</script>