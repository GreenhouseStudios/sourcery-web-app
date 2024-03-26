<template>
  <div>
    <input
      ref="editableText"
      v-model="input"
      type="text"
      class="editable-text-input"
      :size="inputLength"
      :readonly="isReadOnly"
      :maxlength="max"
      :minlength="min"
      required
      @blur="update"
      @input="resize"
      @keyup.enter="update"
      @keyup.tab="update"
    >
    <v-icon v-if="isReadOnly" aria-label="Edit" role="image" aria-hidden="false" @click.prevent="edit">
      mdi-pencil
    </v-icon>
  </div>
</template>

<script>

export default {
    name: 'EditableText',
    props: {
        text: {
            type: String,
            required: true,
            default: 'Label'
        },
        max: {
            type: Number,
            required: false,
            default: 50
        },
        min: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data () {
        return {
            input: this.text,
            isReadOnly: true,
            inputLength: this.text.length
        }
    },
    mounted () {
        console.log(this.$refs)
    },
    methods: {
        resize () {
            this.inputLength = this.input.length
        },
        select () {
            this.$refs.editableText.select()
        },
        edit () {
            this.isReadOnly = false
            this.$refs.editableText.focus()
            this.$refs.editableText.select()
        },
        update () {
            if (this.isReadOnly === false) {
                this.isReadOnly = true
                this.$refs.editableText.blur()
                this.$emit('change', this.input)
            }
        }
    }
}
</script>

<style scoped>
input {
    padding: 3px;
    margin:0
}
input:focus-visible {
    outline: 1px solid gray;
}
</style>

<style lang="scss">
.theme--dark .editable-text-input {
    color: white;
}
</style>
