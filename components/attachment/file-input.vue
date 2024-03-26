<template>
    <form ref="form" class="file-form" @submit.prevent>
        <label class="file-container">
            <input
                ref="fileInput"
                class="file-input"
                type="file"
                :accept="props.accept"
                :capture="props.capture"
                :multiple="props.multiple"
                @change="fileList = $event.target.files"
            >
            <v-btn class="ma-2" :color="props.color" @click="fileInput.click()">
                {{ text }}
                <v-icon end>
                    {{ icon }}
                </v-icon>
            </v-btn>
        </label>
    </form>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        required: false,
        default: 'mdi-cloud-upload'
    },
    color: {
        type: String,
        required: false,
        default: 'primary'
    },
    text: {
        type: String,
        required: false,
        default: 'Upload File'
    },
    accept: {
        type: String,
        required: false,
        default: '.png, .jpg, .jpeg, .tif, .tiff, .pdf'
    },
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture
    capture: {
        type: [String, Boolean],
        required: false,
        default: undefined
    },
    multiple: {
        type: [String, Boolean],
        required: false,
        default: undefined
    }
})

const fileList = defineModel()
const fileInput = ref('fileInput')
</script>

<style scoped>
.file-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.file-input {
  opacity: 0;
  visibility: hidden;
  height:0px;
}
</style>