<template>
    <div id="page-admin-npi">
        <v-container class="py-5">
            <h1>Non-Partner Institution Requests</h1>
            <p>See all pending Non-Partner Institution requests in the system, and choose to delete or resolve them.</p>

            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">Created At</th>
                        <th class="text-left">Created By</th>
                        <th class="text-left">Location</th>
                        <th class="text-left">Title</th>
                        <th class="text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!requests.length">
                        <td colspan="6">No requests found.</td>
                    </tr>
                    <tr v-for="req in requests">
                        <td>{{ req.id }}</td>
                        <td>{{ $filters.normalDate(req.created_at) }}</td>
                        <td>{{ req.user.name || req.user.email }}</td>
                        <td>{{ req.repository_location }}</td>
                        <td>{{ req.title }}</td>
                        <td>
                            <v-btn color="primary" size="small" class="me-2" :to="`/admin/npi/${req.id}`" >View</v-btn>
                            <v-btn color="error" size="small" variant="outlined" @click="deleteUri(req)">Delete</v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-container>

        <v-snackbar v-model="deletedSnackbar" color="success">Request Successfully Deleted</v-snackbar>
    </div>
</template>

<script setup>
const { requests, page, limit, fetchAllUriRequests } = useFetchUriRequests()
const { request, deleteRequest } = useManageUriRequest()

const deletedSnackbar = ref(false)

await fetchAllUriRequests()

async function deleteUri(req) {
    request.value = req
    const success = await deleteRequest()
    if ( success ) {
        deletedSnackbar.value = true
        const currentIndex = requests.value.findIndex(r => r.id === req.id)
        requests.value.splice(currentIndex, 1)
    }
}
</script>