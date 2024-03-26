<template>
    <div id="page-admin-npi-id">
        <v-container>
            <h1>Manage Non-Partner Institution Request</h1>
            <p>This request is not serviceable until it is converted to a normal Sourcery request.  Here, that conversion can happen.</p>

            <v-row>
                <v-col cols="12" md="7">
                    <v-sheet color="surface" elevation="4" rounded class="pa-5">
                        <v-row>
                            <v-col cols="12" md="3"><h3>Request ID</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.id }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Created At</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ $filters.normalDate(request.created_at) }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Created By</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.user.name }} - {{ request.user.email }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Location</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.repository_name }} - {{ request.repository_location }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Title</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.title }}</p></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3"><h3>Description</h3></v-col>
                            <v-col cols="12" md="9"><p class="mb-0">{{ request.description }}</p></v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
                <v-col>
                    <h2 class="mb-2">Convert to Sourcery Request</h2>
                    <repository-select v-model="repository"></repository-select>
                    <v-btn color="primary" class="me-2" @click="convert">Convert to Sourcery Request</v-btn>
                    <v-divider class="my-4"></v-divider>
                    <p>This action will not notify users of any change.</p>
                    <v-btn color="error" @click="deleteUri">Delete Request</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
const { request, repository, fetchUriRequest, convert, deleteRequest } = useManageUriRequest()

await fetchUriRequest()

async function deleteUri() {
    const result = await deleteRequest()
    if ( result ) {
        navigateTo('/admin/npi')
    }
}
</script>