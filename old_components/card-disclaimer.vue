<template>
  <v-card class="px-3 mb-6">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text><slot /></v-card-text>
  </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Disclaimer'
        }
    }
}
</script>
