export default defineNuxtPlugin(nuxtApp => {
    // You can alternatively use this format, which comes with automatic type support
    return {
        provide: {
            filters: {
                normalDate: function (value) {
                    if (!value) { return '' }

                    const d = new Date(value)
                    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
                },
                normalDateAndTime: function (value) {
                    if (!value) { return '' }

                    const d = new Date(value)
                    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString()}`
                },
                shortDateAndTime: function (value) {
                    if (!value) { return '' }

                    const d = new Date(value)
                    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                }
            }
        }
    }
})