<template>
  <v-container>
    <v-row>
      <v-col v-if="!$fetchState.pending" cols="12" md="9">
        <span :class="titleClass">{{ title }} ({{ request.attachments.length }})</span>
        <p v-if="request.attachments.length > 0">
          Click on any attachment to edit.
        </p>
      </v-col>
      <v-col class="d-flex child-flex" cols="12" md="3">
        <!-- File Upload -->
        <file-input
          multiple
          accept=".jpeg,.jpg,.png,.pdf"
          text="Upload File"
          icon="mdi-cloud-upload"
          @change="updateFileList"
        />
      </v-col>
      <!-- Camera Upload/Control WIP -->

      <!-- <v-col class="d-flex child-flex" cols="12" md="3">
        <file-input
          multiple
          accept="image/*,.pdf"
          text="Take Photo"
          icon="mdi-camera"
          capture="environment"
          @change="updateFileList"
        />
      </v-col> -->
    </v-row>

    <!-- Active Uploads -->
    <v-row>
      <v-col cols="12">
        <file-queue :id="id" />
      </v-col>
    </v-row>
    <v-row>
      <!-- Existing Files -->
      <template v-if="request && request.attachments">
        <v-col
          v-for="attachment in request.attachments"
          :class="colClasses"
          cols="12"
          md="6"
          xl="4"
        >
          <file :attachment="attachment" @deleted="attachmentDeleted" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'FileManager',
    props: {
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: false,
            default: 'Uploads'
        },
        titleClass: {
            type: String,
            require: false,
            default: 'text-h6'
        }
    },
    data () {
        return {
            colClasses: 'd-flex child-flex'
        }
    },
    fetch () {
        // Populate the store and local var request
        return this.getById(this.id)
    },
    computed: {
        request () {
            return this.$store.state.supabaseRequest.request
        },
        items () {
            return this.$store.state.fileList.files
        },
        count () {
            return this.$store.state.supabaseRequest.request.length
        }
    },
    mounted () {
        console.log(this.$store.state.supabaseRequest.request)
    },
    methods: {
        ...mapActions({
            getById: 'supabaseRequest/getById',
            addAttachment: 'supabaseRequest/addAttachment',
            deleteAttachment: 'supabaseRequest/deleteAttachment',
            complete: 'supabaseRequest/complete',
            addAll: 'fileList/addAll'
        }),
        updateFileList (fileList) {
            console.info('file list updated', fileList)
            this.addAll(fileList)
        },
        getLocalUrl (file) {
            return URL.createObjectURL(file)
        },
        attachmentDeleted () {
            // Event listener for a deleted file...
            console.log('File component emitted "deleted" event')
        }

    }
}
</script>

<style scoped>
input[type=file]{
    position: absolute;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      outline: none;
      opacity: 0;
}
</style>
