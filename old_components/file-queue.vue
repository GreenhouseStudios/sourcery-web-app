<template>
  <!-- Active Uploads -->

  <v-list v-if="items.length !== 0" three-line>
    <div v-for="item in items">
      <!-- Using "active" as a soft-delete of these queued items -->
      <template v-if="item.active">
        <v-divider />
        <file-uploader :file="item.value" @success="remove(item.key)" @clear="remove(item.key)" @failure="uploadFailed" />
      </template>
    </div>
  </v-list>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'FileQueue',
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            uploaded: false
        }
    },
    async fetch () {
    },
    computed: {
        items () {
            return this.$store.state.fileList.files
        }

    },
    mounted () {
    },
    methods: {
        ...mapMutations({
            removeFileFromQueue: 'fileList/remove'
        }),
        remove (key) {
            console.log('Queue Item Removed:', key)
            this.removeFileFromQueue(key)
        },
        uploadFailed (error) {
            console.log(error)
        }
    }
}
</script>

<style scoped>

</style>
