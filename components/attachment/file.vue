<template>
    <v-row align="center">
        <v-col>
            <v-dialog width="80%" v-model="showDetails" v-if="canService">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-avatar size="150" rounded="0" v-bind="activatorProps">
                        <v-img :src="attachment.thumbnail" :height="150">
                            <v-row class="fill-height ma-0" align="end" justify="end">
                                <div class="pa-1 bg-primary">
                                    <v-icon dark size="large" role="button" class="bg-primary" aria-label="View Image Details">mdi-pencil</v-icon>
                                </div>
                            </v-row>
                        </v-img>
                    </v-avatar>
                </template>

                <template v-slot:default="{ isActive }">
                    <v-card>
                        <v-card-title>
                            <v-row justify="space-between" class="py-3">
                                <v-col cols="8" md="10">
                                    {{ attachment.label }}
                                </v-col>
                                <v-col cols="4" md="2" class="text-right">
                                    <v-btn color="primary" append-icon="mdi-delete" :loading="deleteLoading" @click="deleteMe">Delete</v-btn> 
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <div class="mb-2">File Type: {{ attachment.mime }}</div>
                                    <div class="mb-2">File Size: {{ $filesize(attachment.size) }}</div>
                                    <div class="mb-2">Corrected Citation:</div>
                                    <v-textarea disabled variant="outlined" name="citation" value="Citation corrections are coming soon!"></v-textarea>
                                </v-col>
                                <v-col cols="12" md="8">
                                    <v-img v-if="attachment.url && attachment.mime !== 'application/pdf'" :src="attachment.url" aspect-ratio="1" class="grey lighten-2" max-width="100%" cover></v-img>
                                    <embed v-else :src="`${attachment.url}#toolbar=0&navpanes=1&scrollbar=0`" type="application/pdf" width="100%" height="600px"></embed>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-divider />

                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="primary" variant="text" @click="showDetails = false">
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>

            <v-avatar size="150" rounded="0" v-else>
                <a :href="downloadUrl" class="d-none" ref="downloadLink" download></a>
                <v-img :src="attachment.thumbnail" :height="150" @click="downloadAttachment(attachment.url)">
                    <v-row class="fill-height ma-0" align="end" justify="end">
                        <div class="pa-1 bg-primary">
                            <v-icon dark size="large" role="button" class="bg-primary" aria-label="View Image Details">mdi-download</v-icon>
                        </div>
                    </v-row>
                </v-img>
            </v-avatar>
        </v-col>
        <v-col>
            <div class="mb-2">{{ attachment.label }}</div>
            <div class="text-muted">{{ $filesize(attachment.size) }}</div>
        </v-col>
    </v-row>
</template>

<script setup>
const props = defineProps({
    attachment: {
        type: Object,
        required: true
    },
    canService: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['delete'])

const { deleteAttachment, deleteLoading } = useDeleteAttachment()
const { downloadUrl, downloadLink, downloadAttachment } = useDownloadAttachments()

const showDetails = ref(false)

async function deleteMe() {
    await deleteAttachment(props.attachment)
    showDetails.value = false
    emit('delete', props.attachment)
}
</script>