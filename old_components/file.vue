<template>
  <div>
    <v-dialog v-model="showDetails" width="80%">
      <template #activator="{ on, attrs }">
        <v-row>
          <v-col cols="6">
            <v-img
              v-if="attachment.url"
              :src="previewSrc()"
              aspect-ratio="1"
              class="grey lighten-4 pointer"
              max-width="100%"
              v-bind="attrs"
              v-on="on"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="white" />
                </v-row>
              </template>
              <v-row class="fill-height ma-0" align="end" justify="end">
                <v-icon dark large role="button" class="icon-purple-bg" aria-label="View Image Details">
                  mdi-pencil
                </v-icon>
              </v-row>
            </v-img>
          </v-col>

          <v-col align-self="center">
            <!-- <EditableText :text="label" @change="updateLabel" /> -->
            {{ label }}
          </v-col>
        </v-row>
      </template>

      <v-card>
        <v-card-title class="text-h5">
          <v-row justify="space-between">
            <v-col cols="9" md="10">
              <EditableText :text="label" @change="updateLabel" />
            </v-col>
            <v-col cols="3" md="2" class="text-right">
              <v-btn color="primary" :loading="deleting" :disabled="deleting" @click="deleteThisAttachment()">
                Delete
                <v-icon right dark>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="3" class="font-weight-medium">
              <div class="mb-2">
                File Type: {{ type() }}
              </div>
              <div class="mb-2">
                File Size: {{ $filesize(attachmentSize) }}
              </div>
              <div class="mb-2">
                Corrected Citation:
              </div>
              <v-textarea
                disabled
                outlined
                name="input-7-1"
                value="Citation corrections are coming soon!"
                hint="Hint text"
              />
            </v-col>
            <v-col cols="12" md="9">
              <v-img
                v-if="attachment.url && type() !== 'PDF'"
                :src="attachment.url"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="100%"
              />
              <embed
                v-else
                :src="`${attachment.url}#toolbar=0&navpanes=1&scrollbar=0`"
                type="application/pdf"
                width="100%"
                height="600px"
              >
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showDetails = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Attachment } from '~/models/Attachment'
export default {
    name: 'File',
    props: {
        attachment: {
            type: Attachment,
            required: true,
            default: {}
        }
    },
    data () {
        return {
            showDetails: false,
            attachmentSize: 0,
            deleting: false,
            /**
             * Proxy for the label, since
             * attachment.label is immutable.
             */
            labelProxy: this.attachment.label
        }
    },
    computed: {
        label () {
            if (this.labelProxy !== '') {
                return this.labelProxy
            } else {
                const url = this.attachment.url
                return url.substring(url.lastIndexOf('/') + 1)
            }
        }
    },
    mounted () {
        /**
        * We don't store the filesize, so...
        */
        fetch(this.attachment.url, {
            method: 'HEAD',
            mode: 'cors',
            cache: 'force-cache'
        }).then((response) => {
            // console.log(response)
            this.attachmentSize = response.headers.get('Content-Length')
        })
    },
    methods: {
        ...mapActions({
            deleteAttachment: 'supabaseRequest/deleteAttachment'
        }),
        updateLabel (val) {
            const a = new Attachment(this.attachment)
            a.label = val
            this.labelProxy = val
            try {
                a.insert()
            } catch (error) {
                console.error('Couldn\'t Save Label', error)
            }
        },
        type () {
            return this.attachment.url.substr(this.attachment.url.lastIndexOf('.') + 1).toUpperCase()
        },
        async deleteThisAttachment () {
            this.deleting = true
            if (await this.deleteAttachment(this.attachment)) {
                this.deleting = false
                this.$emit('deleted')
            }
        },
        previewSrc () {
            const sources = {
                PDF: '/img/pdf.svg',
                TIFF: '/img/tiff.svg',
                TIF: '/img/tiff.svg'
            }
            if (Object.prototype.hasOwnProperty.call(sources, this.type())) {
                return sources[this.type()]
            } else {
                return this.attachment.url
            }
        }

    }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.icon-purple-bg {
  background-color: #654EA3;
  padding-top: 3px;
  padding-left: 2px;
  border-top-left-radius: 2px;
}
</style>
