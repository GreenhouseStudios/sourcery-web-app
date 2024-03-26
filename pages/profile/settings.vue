<template>
    <div id="page-profile-settings">
        <v-container class="py-6">
            <h1>Settings</h1>

            <v-list class="bg-transparent">
                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon>mdi-brightness-7</v-icon>
                    </template>
                    <v-list-item-title>Theme</v-list-item-title>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ToggleTheme />
                        </v-list-item-action>
                    </template>
                </v-list-item>
            </v-list>

            <v-list class="bg-transparent">
                <v-list-item lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-account</v-icon>
                    </template>
                    <v-list-item-title>Name</v-list-item-title>
                    <v-list-item-subtitle>{{ authUser.name }}</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ProfileChangeName />
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-email</v-icon>
                    </template>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ authUser.email }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item lines="two">
                    <template v-slot:prepend>
                        <v-icon>mdi-phone</v-icon>
                    </template>
                    <v-list-item-title>Phone</v-list-item-title>
                    <v-list-item-subtitle>{{ authUser.phone ?? 'No data.' }}</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ProfileChangePhone />
                        </v-list-item-action>
                    </template>
                </v-list-item>

                <v-list-item>
                    <template v-slot:prepend>
                        <v-icon>mdi-lock</v-icon>
                    </template>
                    <v-list-item-title>Password</v-list-item-title>
                    <template v-slot:append>
                        <v-list-item-action end>
                            <ProfileChangePassword />
                        </v-list-item-action>
                    </template>
                </v-list-item>
            </v-list>
        </v-container>
    </div>
</template>

<script setup>
const { authUser } = useAuthUser()
</script>