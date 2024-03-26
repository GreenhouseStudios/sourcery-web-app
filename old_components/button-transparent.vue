<template>
  <v-btn
    text
    :to="to"
    class="sourcery-btn-transparent"
  >
    <v-icon v-if="icon">
      {{ icon }}
    </v-icon>
    {{ text }}
  </v-btn>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        },
        text: {
            type: String,
            default: 'Click Me'
        },
        icon: {
            type: String,
            default: ''
        }
    }
}
</script>

<style>
@media print {
    .sourcery-btn-transparent {
        display: none !important;
    }
}
</style>
