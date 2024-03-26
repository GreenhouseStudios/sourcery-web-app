<template>
    <div>
        <v-form v-model="archiveNotesValid" @submit.prevent="saveNotes">
            <v-textarea
                class="mb-3"
                v-model="archiveNotes"
                label="Fulfillment Notes"
                rows="5"
                variant="outlined"
                placeholder="Provide any amount of details, description, feedback, or even links to external documents or pages."
                :counter="6000"
                :rules="[$sourceryForms.rules.largeTextAreaCounter]"></v-textarea>

            <v-textarea
                class="mb-3"
                v-model="archiveCitation"
                label="Suggested Citation"
                placeholder="An opportunity to provide a suggested or corrected citation for the documents requested."
                rows="3"
                variant="outlined"
                :counter="1000"
                :rules="[$sourceryForms.rules.characterCount1000]"></v-textarea>

            <v-btn type="submit" color="primary">Save</v-btn>
        </v-form>
    </div>
</template>

<script setup>
const props = defineProps(['request'])
const { archiveNotes, archiveCitation, archiveNotesValid, saveNotes } = useArchiveNotes(props.request)
</script>
