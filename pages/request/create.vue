<template>
    <div id="page-request-create">
        <v-container>
            <v-row justify="center">
                <v-col sm="10" md="8">
                    <h1 class="mb-4">Create a Request</h1>

                    <v-form v-model="requestFormValid" validate-on="submit" @submit.prevent="createRequest">
                        <h2 class="mb-4">Select Repository</h2>

                        <v-img max-height="200" rounded="lg" :src="bannerImage" class="mb-4"></v-img>

                        <repository-select v-model="repository"></repository-select>

                        <v-alert color="primary" icon="$info" v-if="repository" class="mb-4">You have selected the {{ repository.name }} at {{ repository.organization.name }}.</v-alert>


                        <h2 class="mb-4 mt-10">Document Information</h2>
                        <v-text-field v-model="requestFields.user.name" variant="outlined" class="mb-2" label="Your Name" :rules="[$sourceryForms.rules.required]" counter="100"></v-text-field>
                        <v-text-field v-model="requestFields.user.email" variant="outlined" class="mb-2" disabled readonly label="Your Email" :rules="[$sourceryForms.rules.email]"></v-text-field>
                        <v-text-field v-model="requestFields.title" variant="outlined" class="mb-2" label="Request Title" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.characterCount100]" counter="100"></v-text-field>

                        <p>Help the folks on the other end locate your document(s) by providing as much relevant information as you have (e.g. page numbers, box or folder numbers, collections, links, citations).</p>
                        <v-textarea v-model="requestFields.details" variant="outlined" class="mb-2" label="Request Details" :rules="[$sourceryForms.rules.required, $sourceryForms.rules.largeTextAreaCounter]" counter="6000"></v-textarea>

                        <div class="d-flex justify-space-between my-3 mb-8">
                            <v-btn to="/dashboard" color="surface">Back</v-btn>
                            <v-btn type="submit" color="primary" >Submit</v-btn>
                        </div>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog v-model="requestCreatedSubmitDialog" width="600">
            <v-card title="Submitting Request">
                <v-card-text v-if="requestFormError">
                    <v-alert color="error" icon="$error" :text="requestFormError"></v-alert>
                </v-card-text>
                <v-card-text class="text-center my-5" v-if="requestFormLoading">
                    <v-progress-circular indeterminate color="primary" size="60" width="7"></v-progress-circular>
                </v-card-text>
                <v-card-text v-if="createdRequest" class="text-center">
                    <v-icon icon="mdi-check-circle-outline" color="primary" class="icon-very-large my-3"></v-icon>
                    <p>Congratulations, you have successfully created a request!</p>
                </v-card-text>
                <v-card-actions v-if="createdRequest">
                    <v-spacer></v-spacer>

                    <v-btn text="Back to Dashboard" to="/dashboard" variant="text"></v-btn>
                    <v-btn text="View Request" :to="`/request/${createdRequest.id}`" variant="text" color="primary"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
const { repository, bannerImage } = useSelectRepository()
const { $sourceryForms } = useNuxtApp()
const {
    requestFields,
    requestFormValid,
    requestFormLoading,
    requestFormError,
    createdRequest,
    requestCreatedSubmitDialog,
    requestFormPopulateCurrentUser,
    createRequest
} = useCreateRequest()

// I would set this up as a normal ref, but I don't feel like keeping track of other .value calls in composables
watch(repository, () => {
    requestFields.value.repository = repository.value
})

await requestFormPopulateCurrentUser()
</script>

<style scoped lang="scss">
.icon-very-large {
    font-size: 80px;
}
</style>