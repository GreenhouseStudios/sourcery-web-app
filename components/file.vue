<template>
  <div>
    <v-img
      v-if="src"
      :src="src"
      aspect-ratio="1"
      class="grey lighten-2"
      max-width="100%"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey lighten-5" />
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script>

export default {
    name: 'File',
    props: {
        src: {
            type: String,
            required: true,
            default: '#'
        }
    },
    data () {
        return {
        }
    },
    computed: {
    },
    mounted () {
    }
}
</script>

<style scoped>
</style>