<template>
  <div>
    <v-btn
      v-if="to"
      :to="to"
      :block="block"
      x-large
      class="text-uppercase gradient-button"
      :style="gradientStyle"
      :disabled="disabled"
    >
      {{ displayText }}
    </v-btn>

    <v-btn
      v-else
      :block="block"
      x-large
      class="text-uppercase gradient-button"
      :style="gradientStyle"
      :disabled="disabled"
      @click="clickAction"
    >
      {{ displayText }}
    </v-btn>
  </div>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            default: null
        },
        text: {
            type: String,
            required: true
        },
        clickAction: {
            type: Function,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        leftGradient: {
            type: String,
            default: '#654EA3'
        },
        rightGradient: {
            type: String,
            default: '#431A5A'
        },
        block: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        displayText () {
            if (this.$vuetify?.breakpoint?.mobile) {
                return this.text.replace('and', '&')
            }
            return this.text
        },
        buttonClass () {
            let c = 'text-uppercase gradient-button'
            if (this.light) {
                c += ' gradient-button-light'
            }
            return c
        },
        gradientStyle () {
            const s = `background: linear-gradient(45deg, ${this.leftGradient}, ${this.rightGradient});`
            return s
        }
    }
}
</script>

<style scoped>
.gradient-button {
    max-width: 100%;
}
</style>

<style>
.theme--light.gradient-button {
    color: white;
}

@media print {
    .gradient-button {
        display: none !important;
    }
}
</style>
