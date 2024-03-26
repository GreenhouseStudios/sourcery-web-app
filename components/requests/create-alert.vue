<template>
    <div class="request-cta-alert rounded-lg px-5 py-4 mb-6">
        <v-row align="center">
            <v-col cols="12" md="8">
                <h3 class="mb-4 mt-0">Ready to try Sourcery?</h3>
                <p class="mb-0">Our registered institutions are ready to help you locate the reference scans you seek.  By creating a request, we can get that process started for you.</p>
            </v-col>
            <v-col cols="12" md="4" class="text-md-right mb-md-0 mb-1">
                <v-btn color="primary" size="large" to="/request/create" class="justify-end">Create Request</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.request-cta-alert {
    background: rgba(#c5aeef, 0.4);
    border: 2px solid #c5aeef;
}
</style>