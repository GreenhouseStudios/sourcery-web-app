import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const is_dark = localStorage.getItem('dark_theme')
    let dark_theme = false
    if (is_dark !== undefined) {
        if (is_dark === 'true') {
           dark_theme = true
        } else {
            dark_theme = false
        }
    } else {
        localStorage.setItem('dark_theme', mq.matches.toString())
        dark_theme = localStorage.getItem('dark_theme') === "true" ? true : false
    }


    const vuetify = createVuetify({
        theme: {
            defaultTheme: dark_theme ? 'dark' : 'light',
            themes: {
                light: {
                    colors: {
                        background: '#f9f8fc', // This is the 'primary' color but in HSL w/ 97% lightness
                        // surface: '#f9f8fc',
                        primary: '#654EA3',
                        secondary: '#c5aeef',
                        error: '#b71c1c',
                        'surface-variant': '#ffffff',
                        'on-surface-variant': '#000000',
                        'muted': '#9e9e9e'
                    }
                },
                dark: {
                    colors: {
                        surface: '#363636',
                        primary: '#c5aeef',
                        secondary: '#2f2740',
                        'surface-variant': '#1a1a1a',
                        'on-surface-variant': '#ffffff',
                        'muted': '#9e9e9e'
                    }
                }
            }
        }
    })

    app.vueApp.use(vuetify)
})