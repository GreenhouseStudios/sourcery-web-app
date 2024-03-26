<template>
  <svg
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 277.01 294.33"
    class="svg-sparkle"
  >
    <polygon class="cls-1" points="206.1 116.36 277.01 92.86 205.96 70.49 182.6 0 160.36 70.62 89.74 92.86 160.23 116.22 182.6 187.27 206.1 116.36" />
    <polygon class="cls-1" points="85.81 223.42 138.1 206.08 85.71 189.59 68.48 137.6 52.08 189.69 0 206.08 51.98 223.32 68.48 275.71 85.81 223.42" />
    <polygon class="cls-1" points="225.96 260.34 259.95 249.07 225.89 238.35 214.69 204.57 204.04 238.41 170.19 249.07 203.97 260.27 214.69 294.33 225.96 260.34" />
  </svg>
</template>

<script>
export default {
    props: {
        height: {
            type: String,
            default: '28'
        }
    }
}
</script>

<style>
.svg-sparkle {
    fill: white;
}
</style>
