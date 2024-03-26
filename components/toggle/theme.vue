<template>
    <v-btn-toggle color="primary" @update:modelValue="setDark" v-model="themeValue">
        <v-btn :value="false">
            <v-icon class="hidden-sm-and-down" left>mdi-brightness-7</v-icon>
            <span>Light</span>
        </v-btn>
        <v-btn :value="true">
            <v-icon class="hidden-sm-and-down" left>mdi-brightness-3</v-icon>
            <span>Dark</span>
        </v-btn>
    </v-btn-toggle>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()
const { setDark } = useToggleTheme()

const themeValue = ref(theme.global.current.value.dark)
</script>