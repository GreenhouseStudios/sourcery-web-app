/**
 * Wrapper for standardizing filesize usage in the app
 * @url https://github.com/avoidwork/filesize.js
 */
import filesize from 'filesize'

export default defineNuxtPlugin(nuxtApp => {  
    // You can alternatively use this format, which comes with automatic type support
    return {
        provide: {
            filesize: size => filesize(size, {
                base: 2
            })
        }
    }
})
  