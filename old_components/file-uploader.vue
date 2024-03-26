<template>
  <v-list-item three-line>
    <v-list-item-avatar v-if="!clearable">
      <v-img :src="getImagePreview(file)" />
    </v-list-item-avatar>
    <v-list-item-content v-if="!clearable">
      <v-list-item-title class="font-weight-medium" v-html="file.name" />
      <v-list-item-subtitle v-html="status" />
      <v-progress-linear color="primary" height="10" indeterminate striped />
    </v-list-item-content>

    <v-list-item-content v-if="clearable">
      <v-alert dismissible type="error" @input="clear">
        {{ status }}
      </v-alert>
    </v-list-item-content>
    <!-- <v-list-item-action v-if="clearable">
      <v-btn icon @click="clear">
        <v-icon color="grey lighten-1">
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-list-item-action> -->
  </v-list-item>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'FileUploader',
    props: {
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        file: {
            type: File,
            required: true
        }
    },
    data () {
        return {
            status: '',
            clearable: false,
            show: true
        }
    },
    async fetch () {
    },
    computed: {
        ...mapActions({
            addAttachment: 'supabaseRequest/addAttachment'
        })
    },
    mounted () {
        if (this.file.size >= this.$config.public.maxUploadBytes) {
            // File is too large
            this.fileTooLarge()
        } else {
            this.uploadFile()
        }

        /**
         * If it's a TIFF, we need to convert it
         */
        // if (this.isTIFF()) {
        //     this.convertTiff()
        //         .then(imageObject => imageObject.toBase64())
        //         .then((encoded) => {
        //             console.log(encoded)
        //             // this.uploadFile(encoded)
        //         }).catch((error) => {
        //             console.error('There was a problem converting this TIFF', error)
        //         })
        // } else {
        //     this.uploadFile()
        // }
    },
    methods: {
        getImagePreview (file) {
            const thumbnails = {
                'image/tiff': '/img/tiff.svg',
                'application/pdf': '/img/pdf.svg'
            }
            if (Object.prototype.hasOwnProperty.call(thumbnails, file.type)) {
                return thumbnails[file.type]
            } else {
                return URL.createObjectURL(file)
            }
        },
        // convertTiff () {
        //     this.status = 'Converting...'
        //     return this.file.arrayBuffer()
        //         .then(buffer => Image.load(buffer))
        //         .catch((error) => {
        //             console.error('There was a problem loading your TIFF', error)
        //         })
        // },
        uploadFile (encoded = null) {
            this.status = 'Uploading...'
            this.$store.dispatch('supabaseRequest/addAttachment', this.file, encoded).then(() => {
                this.$emit('success')
            }).catch((error) => {
                this.$emit('failure', error)
            })
        },
        fileTooLarge () {
            this.status = `The selected file (${this.file.name}) is too large (${this.$filesize(this.file.size)})`
            this.clearable = true
            this.$emit('failure', 'File is too large')
        },
        clear () {
            console.log('Clear was clicked')
            this.$emit('clear')
        },
        isPDF () {
            return this.file.type === 'application/pdf'
        },
        isJPEG () {
            return this.file.type === 'image/jpg'
        },
        isTIFF () {
            return this.file.type === 'image/tiff'
        }

    }
}
</script>

<style scoped>

</style>
