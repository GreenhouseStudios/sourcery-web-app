<template>
    <v-dialog width="500" v-model="dialog">
        <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" text="Change"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Change Name">
                <v-form @submit.prevent="submitChange">
                    <v-card-text>
                        <v-text-field label="Your Name" variant="outlined" v-model="name"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                        <v-btn type="submit" color="primary" variant="text">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
const { authUser } = useAuthUser()
const { updateProfile } = useUpdateProfile()

const dialog = ref(false)
const name = ref(authUser.value.name)

async function submitChange(output) {
    await updateProfile({
        name: name.value
    })
    dialog.value = false
}
</script>