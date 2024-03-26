<template>
    <v-row align="center">
        <v-col cols="12" md="9">
            <p class="mb-0" v-if="request.attachments.length > 0">
                <span v-if="canService">Click on any attachment to edit.</span>
                <span v-else>Click on any attachment to download.</span>
            </p>
            <p class="mb-0" v-else>No attachments have been uploaded.</p>
        </v-col>
        <v-col class="d-flex child-flex" cols="12" md="3">
            <!-- File Upload -->
            <attachment-file-input multiple accept=".jpeg,.jpg,.png,.pdf" text="Upload File" icon="mdi-cloud-upload" v-model="fileList" v-if="canService && !isCancelled && !isArchived && !isCompleted" />
            <v-btn v-else color="primary" @click="downloadAttachments(request)" :disabled="!request.attachments.length" :loading="downloadLoading" append-icon="mdi-download">Download All</v-btn>
        </v-col>
    </v-row>
        
    <v-row v-if="files.length">
        <v-col>
            <v-list lines="three">
                <template v-for="file in files">
                    <v-divider v-if="file.active"></v-divider>
                    <v-list-item v-if="file.active">
                        <template v-slot:prepend>
                            <v-avatar size="60" rounded="0">
                                <v-img :src="file.thumbnail"></v-img>
                            </v-avatar>
                        </template>

                        <template v-if="!file.clearable">
                            <v-list-item-title class="mb-1">{{ file.value.name }}</v-list-item-title>
                            <v-list-item-subtitle v-html="file.status" class="mb-1"></v-list-item-subtitle>
                            <v-progress-linear color="primary" height="10" indeterminate striped></v-progress-linear>
                        </template>

                        <template v-else>
                            <v-alert closable :icon="false" type="error" @click:close="remove(file.key)">
                                {{ file.status }}
                            </v-alert>
                        </template>
                    </v-list-item>
                </template>
            </v-list>
        </v-col>
    </v-row>

    <v-row>
        <v-col v-for="attachment in request.attachments" cols="12" sm="6" md="4">
            <attachment-file :attachment="attachment" :can-service="canService" @delete="removeFromRequest"></attachment-file>
        </v-col>
    </v-row>

    <v-snackbar v-model="showDeletedSnackbar" color="success">Attachment Successfully Deleted</v-snackbar>
        
        
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
</template>

<script setup>
const props = defineProps(['request'])
const { fileList, files, remove } = useFileList(props.request)
const { downloadLoading, downloadAttachments } = useDownloadAttachments()
const { canService, isCompleted, isCancelled, isArchived } = useFetchRequest(props.request)

const showDeletedSnackbar = ref(false)

function removeFromRequest(attachment) {
    const index = props.request.attachments.findIndex((a) => a.id === attachment.id)
    if (index !== -1) {
        props.request.attachments.splice(index, 1)
        showDeletedSnackbar.value = true
    }
}
</script>