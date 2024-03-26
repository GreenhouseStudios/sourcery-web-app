<template>
    <header class="pa-4 px-md-16">
        <div class="d-flex justify-space-between align-center">
            <NuxtLink id="wordmark-link" to="/">
                <img id="logo" src="/img/logo-wordmark-beta-white.svg" alt="Sourcery Logo">
            </NuxtLink>
            <div class="d-none d-md-flex">
                <v-btn
                    :variant="item.variant ? item.variant : 'text'"
                    class="ms-4 text-white"
                    v-for="item in menuItemsDesktop"
                    :to="!item.external ? item.to : null"
                    :href="item.external ? item.to : null"
                    size="large"
                    :border="item.variant ? false : 'none'">
                    {{ item.title }}
                </v-btn>
            </div>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" variant="text" icon="mdi-menu" class="d-flex d-md-none"></v-btn>
                </template>
                <v-list dense nav>
                    <v-list-item
                        :to="!item.external ? item.to : null"
                        :href="item.external ? item.to : null"
                        color="primary"
                        v-for="item in menuItemsMobile"
                    >
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </header>
</template>

<script setup>
const user = useSupabaseUser()

const menuItems = ref([
    { title: 'Home', to: '/', icon: 'mdi-home', desktop: false },
    { title: 'About', to: '/about', icon: 'mdi-information', desktop: true },
    { title: 'Roadmap', to: '/roadmap', icon: 'mdi-chart-timeline-variant', desktop: true },
    { title: 'Team', to: '/team', icon: 'mdi-account-multiple', desktop: true },
    { title: 'Blog', to: 'https://sourceryapp.substack.com/', icon: 'mdi-rss', desktop: true, external: true },
    { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard', desktop: true, auth: true, variant: 'outlined' },
    { title: 'Login', to: '/login', icon: 'mdi-login', desktop: true, auth: false, variant: 'outlined' }
])

const menuItemsDesktop = computed(() => menuItems.value.filter(item => {
    let show = true
    if (item.auth) {
        show = !!user.value
    }
    if (item.auth === false) {
        show = !user.value
    }
    return show && item.desktop
}))

const menuItemsMobile = computed(() => menuItems.value.filter(item => {
    let show = true
    if (item.auth) {
        show = !!user.value
    }
    if (item.auth === false) {
        show = !user.value
    }
    return show
}))
</script>

<style scoped lang="scss">
header {
    background: rgb(146, 79, 190);
    background: linear-gradient(
        135deg,
        rgba(146, 79, 190, 1) 0%,
        rgba(111, 77, 170, 1) 50%
    );
    position: sticky;
    top:0;
    left:0;
    right:0;
    z-index:1;
}

#logo {
    height: 32px;
}
</style>