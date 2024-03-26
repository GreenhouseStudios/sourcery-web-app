<template>
  <div class="copy-text-box">
    <div v-if="text" class="copy-text d-flex align-center">
      <p class="mr-auto">
        {{ text }}
      </p>
      <v-btn icon :class="$vuetify.theme.dark ? 'copy-text-btn copy-text-btn-dark ml-4' : 'copy-text-btn ml-4'" @click="copyText">
        <v-icon>
          {{ copyIcon }}
        </v-icon>
      </v-btn>
    </div>

    <p v-else>
      {{ defaultText }}
    </p>
  </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: null
        },
        defaultText: {
            type: String,
            default: 'No citation provided.'
        }
    },
    data () {
        return {
            hasCopied: false
        }
    },
    computed: {
        copyIcon () {
            return this.hasCopied ? 'mdi-check' : 'mdi-content-copy'
        }
    },
    methods: {
        copyText () {
            navigator.clipboard.writeText(this.text)
            this.hasCopied = true
            this.$toast.success('Copied to clipboard.')
        }
    }
}
</script>

<style lang="scss">
.copy-text-box {
    padding: 10px;
    font-size: 18px;
    &.copy-text-box-dark {
        background-color: rgba(0, 0, 0, 0.2);
    }
}
</style>
