<template>
    <div class="organization-view-alert rounded-lg px-5 py-4 mb-6">
        <v-row align="center">
            <v-col cols="12" md="8">
                <h3 class="mb-4 mt-0">{{ organization.name }}</h3>
                <p class="mb-0">You are currently viewing your personal dashboard for requests you have placed.  If you want to view requests for {{ organization.name }}, switch to the organization dashboard.</p>
            </v-col>
            <v-col cols="12" md="4" class="text-md-right mb-md-0 mb-1">
                <v-btn color="primary" size="large" :to="`/o/${organization.id}`" class="justify-end">Switch Dashboard</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
const props = defineProps(['organization'])
</script>

<style lang="scss" scoped>
.organization-view-alert {
    background: rgba(#c5aeef, 0.4);
    border: 2px solid #c5aeef;
}
</style>