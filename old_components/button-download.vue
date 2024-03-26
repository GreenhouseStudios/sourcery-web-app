<template>
  <v-dialog v-model="dialogOpen" width="500">
    <template #activator="{ on, attrs }">
      <v-btn
        block
        x-large
        class="text-uppercase gradient-button"
        :loading="loading"
        :disabled="loading"
        v-bind="attrs"
        v-on="on"
      >
        {{ text }}
        <template #loader>
          <span>Loading<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></span>
        </template>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Download Request Attachments</v-card-title>
      <v-card-text>
        <p>Download all attachments for this request as a zip file.</p>
        <p>Included will be a JSON-LD file that can be imported into Tropy using the Sourcery for Tropy plugin.</p>
        <p>This operation can take some time if there are a large number of attachments in the request.</p>
        <v-progress-circular :value="zippingValue" /> {{ status }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="clickButton">
          Download
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Promise } from 'bluebird'
import JsZip from 'jszip'
// import { Attachment } from '~/models/Attachment'
import { saveAs } from 'file-saver'
import { Request } from '~/models/Request'

export default {
    props: {
        text: {
            type: String,
            required: true
        },
        request: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            loading: false,
            modelRequest: new Request(this.request),
            dialogOpen: false,
            zippingValue: 0,
            status: 'Waiting for action.'
        }
    },
    methods: {
        async clickButton () {
            this.loading = true
            await this.exportZipFile()
            this.loading = false
        },
        downloadByGroup (attachments, filesPerGroup = 5) {
            return Promise.map(
                attachments,
                async (attachment) => {
                    const blob = await attachment.getDownloadBlob()
                    return {
                        blob,
                        attachment
                    }
                },
                {
                    concurrency: filesPerGroup
                }
            )
        },
        async exportZipFile () {
            if (!this.request?.attachments) {
                return false
            }

            const num_attachments = this.request.attachments.length
            this.zippingValue = 0
            this.status = 'Starting zip file creation.'

            const attachmentMeta = await this.downloadByGroup(this.request.attachments, 5)

            this.zippingValue = 20
            this.status = 'Files downloaded. Starting to compress.'

            const zip = JsZip()
            attachmentMeta.forEach(({ blob, attachment }, i) => {
                this.zippingValue = (70 / num_attachments) * (i + 1)
                zip.file(attachment.getFileNameAndExtension(), blob)
            })

            this.status = 'Files compressed. Adding JSON-LD file.'

            zip.file('tropy-upload-me.jsonld', JSON.stringify(this.$getJsonLdFile(this.request)))

            this.zippingValue += 5

            const z = await zip.generateAsync({ type: 'blob' })

            const fileName = `request-${this.request.id}-files.zip`

            // if (this.request.attachments.length > 0) {
            //     return null
            // }

            this.zippingValue = 100
            this.status = 'Download starting.'
            return saveAs(z, fileName)
        }
    }
}
</script>

<style scoped>
.gradient-button {
    background: linear-gradient(45deg, #654EA3, #431A5A);
}
</style>

<style>
.theme--light.gradient-button {
    color: white;
}

.dot {
    position: relative;
    display: inline-block;
    animation: dotVertical 1.2s infinite linear;
}

.dot2 {
    animation-delay: 0.2s;
}

.dot3 {
    animation-delay: 0.4s;
}

@keyframes dotVertical {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-3px);
    }

    100% {
        transform: translateY(0px);
    }
}

@media print {
    .gradient-button {
        display: none !important;
    }
}
</style>
