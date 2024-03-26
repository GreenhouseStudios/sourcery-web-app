/**
 * Intended to inject $sourceryForms into application, so we can have global form rules.
 */

const special_characters = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '_', '-', '+', '=', '`', '|', '(', ')', '{', '}', '[', ']', ':', ';', "'", '<', '>', ',', '.', '?', '/']

export default defineNuxtPlugin(nuxtApp => {
    const sourceryForms = {
        rules: {
            required: value => !!value || 'This field is required.',
            counter: value => value.length <= 20 || 'Max 20 characters',
            email: (value) => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
            password: [
                v => v.length >= 8 || 'Password must be at least 8 characters',
                v => special_characters.some(substring => v.includes(substring)) || 'Password must contain 1 special character'
            ],
            largeTextAreaCounter: value => value.length < 6000 || 'Max 6000 characters',
            characterCount1000: value => value.length <= 1000 || 'Max 1000 characters',
            characterCount100: value => value.length <= 100 || 'Max 100 characters'
        },
        special_characters
    }

    return {
        provide: {
            sourceryForms
        }
    }
})
