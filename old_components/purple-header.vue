<template>
  <header class="py-4 px-4 px-md-16">
    <div class="nav-bar d-flex justify-space-between align-center">
      <NuxtLink id="wordmark-link" to="/">
        <img id="logo" src="/img/logo-wordmark-beta-white.svg" alt="Sourcery Logo">
      </NuxtLink>
      <div class="d-none d-sm-flex">
        <v-btn
          text
          color="white"
          large
          :to="item.to"
          min-width="96px"
          v-for="item in menuItems"
        >
          {{ item.title }}
        </v-btn>
      </div>
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            class="d-flex d-sm-none"
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list dense nav>
          <v-list-item
            :to="item.to"
            color="primary"
            v-for="item in menuItems"
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
const menuItems = ref([
    { title: 'Home', to: '/', icon: 'mdi-home', desktop: false },
    { title: 'About', to: '/about', icon: 'mdi-information', desktop: true },
    { title: 'Roadmap', to: '/roadmap', icon: 'mdi-chart-timeline-variant', desktop: true },
    { title: 'Team', to: '/team', icon: 'mdi-account-multiple', desktop: true },
    { title: 'Blog', to: 'https://sourceryapp.substack.com/', icon: 'mdi-rss', desktop: true },
    { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard', desktop: true },
    { title: 'Login', to: '/login', icon: 'mdi-login', desktop: true }
])
</script>

<style scoped>
header {
    background: rgb(146, 79, 190);
    background: linear-gradient(
        135deg,
        rgba(146, 79, 190, 1) 0%,
        rgba(111, 77, 170, 1) 50%
    );
}
.nav-bar {
    width: 100%
}

h1 {
    margin-top: 64px;
    margin-bottom: 64px;
}
#logo {
  height: 32px
}
</style>
