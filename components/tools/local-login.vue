<template>
    <div class="tool-local-login mb-6">
        <v-card class="mx-auto" prepend-icon="mdi-cog">
            <template v-slot:title>
                Welcome to Sourcery Local Development
            </template>
            <v-card-text>This is a tool for local development. You can log in as an admin or a user.</v-card-text>
            <v-card-actions>
                <v-btn @click="logInLocalUser('admin')">Login as Admin</v-btn>
                <v-btn @click="logInLocalUser('test')">Login as User</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>


<script setup>
const supabase = useSupabaseClient()

async function logInLocalUser(role) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${role}@sourceryapp.org`,
        password: 'password'
    })

    navigateTo('/dashboard')
}
</script>