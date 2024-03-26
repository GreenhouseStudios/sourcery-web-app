<template>
  <v-icon class="loading-icon">
    mdi-loading
  </v-icon>
</template>

<style scoped>
.loading-icon {
    animation-name: spin;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    margin-right: 10px;
}

@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}
</style>
