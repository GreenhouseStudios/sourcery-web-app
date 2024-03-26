<template>
  <v-dialog
    v-model="open"
    :width="width"
  >
    <slot />
  </v-dialog>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            default: 500
        }
    },
    data () {
        return {
            open: false
        }
    },
    methods: {
        openDialog () {
            this.open = true
        },
        closeDialog () {
            this.open = false
        }
    }
}
</script>
