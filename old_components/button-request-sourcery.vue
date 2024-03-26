<template>
  <a :class="linkClass" :style="styleTagText" :href="buttonLink">
    <span :style="styleSpanTagText">Request with Sourcery</span>
    <svg height="28" :style="imageStyleTagText" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.01 294.33"><defs><style>.cls-1{ {{ svgPolygonStyle }} }</style></defs><polygon class="cls-1" points="206.1 116.36 277.01 92.86 205.96 70.49 182.6 0 160.36 70.62 89.74 92.86 160.23 116.22 182.6 187.27 206.1 116.36" /><polygon class="cls-1" points="85.81 223.42 138.1 206.08 85.71 189.59 68.48 137.6 52.08 189.69 0 206.08 51.98 223.32 68.48 275.71 85.81 223.42" /><polygon class="cls-1" points="225.96 260.34 259.95 249.07 225.89 238.35 214.69 204.57 204.04 238.41 170.19 249.07 203.97 260.27 214.69 294.33 225.96 260.34" /></svg>
  </a>
</template>

<script>
export default {
    props: {
        dark: {
            type: Boolean,
            default: true
        },
        rounded: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            svgHeight: '28',
            buttonLink: 'https://sourceryapp.org'
        }
    },
    computed: {
        styleTagText () {
            let styles = 'font-size: 14px;font-family: sans-serif;border: 1px solid black;font-weight: bold; text-decoration: none; box-sizing: border-box; text-align: center; display: inline-flex; align-items: center; justify-content: space-between;'

            if (this.dark) {
                styles += 'color: white; background-color: black; border-color: white;'
            } else {
                styles += 'color: black; background-color: white; border-color: black;'
            }

            if (this.rounded) {
                styles += 'border-radius: 20px; padding: 3px 20px;'
            } else {
                styles += 'border-radius: 5px; padding: 3px 15px;'
            }

            return styles
        },
        styleSpanTagText () {
            const styles = 'padding: 6px 0px; line-height: 22px;'
            return styles
        },
        imageStyleTagText () {
            const styles = 'line-height: 1;margin-left:11px;'
            return styles
        },
        svgPolygonStyle () {
            let styles = 'fill: '

            if (this.dark) {
                styles += 'white;'
            } else {
                styles += '#333;'
            }

            return styles
        },
        linkClass () {
            let c = 'request-with-sourcery-btn'
            if (this.dark) {
                c += ' sourcery-btn-dark'
            }
            return c
        },
        markup () {
            return `<a class="${this.linkClass}" style="${this.styleTagText}" href="${this.buttonLink}"><span style="${this.styleSpanTagText}">Request with Sourcery</span> <svg height="${this.svgHeight}" style="${this.imageStyleTagText}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.01 294.33"><defs><style>.cls-1{${this.svgPolygonStyle}}</style></defs><polygon class="cls-1" points="206.1 116.36 277.01 92.86 205.96 70.49 182.6 0 160.36 70.62 89.74 92.86 160.23 116.22 182.6 187.27 206.1 116.36" /><polygon class="cls-1" points="85.81 223.42 138.1 206.08 85.71 189.59 68.48 137.6 52.08 189.69 0 206.08 51.98 223.32 68.48 275.71 85.81 223.42" /><polygon class="cls-1" points="225.96 260.34 259.95 249.07 225.89 238.35 214.69 204.57 204.04 238.41 170.19 249.07 203.97 260.27 214.69 294.33 225.96 260.34" /></svg></a>`
        },
        hoverCSS () {
            if (this.dark) {
                return '.request-with-sourcery-btn.sourcery-btn-dark:hover{background-color: #3f3f3f!important;}'
            }
            return '.request-with-sourcery-btn:hover{background-color: #ededed!important;border-color: #ededed!important;}'
        }
    }
}
</script>

<style>
.request-with-sourcery-btn:hover {
    background-color: #ededed!important;
    border-color: #ededed!important;
}

.request-with-sourcery-btn.sourcery-btn-dark:hover {
    background-color: #3f3f3f!important;
}
</style>
