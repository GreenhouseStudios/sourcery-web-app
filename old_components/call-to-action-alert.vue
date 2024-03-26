<template>
  <v-alert
    :type="type"
    class="warning-with-cta"
  >
    {{ message }}
    <NuxtLink :to="to">
      {{ actionText }}
    </NuxtLink>
  </v-alert>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true,
            default: 'This is the default message.'
        },
        to: {
            type: String,
            required: true,
            default: '/dashboard'
        },
        type: {
            type: String,
            default: 'warning'
        },
        actionText: {
            type: String,
            default: 'Go Home.'
        }
    }
}
</script>

<style scoped>
.warning-with-cta.warning .v-alert__content a {
  color: black;
}
</style>
