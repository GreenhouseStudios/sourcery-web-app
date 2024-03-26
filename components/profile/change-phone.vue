<template>
    <v-dialog width="500" v-model="dialog">
        <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" text="Change"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Change Phone Number">
                <v-form @submit.prevent="submitChange">
                    <v-card-text>
                        <v-text-field label="Phone #" variant="outlined" v-model="phone"></v-text-field>
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
const phone = ref(authUser.value.phone)

async function submitChange(output) {
    await updateProfile({
        phone: phone.value
    })
    dialog.value = false
}
</script>