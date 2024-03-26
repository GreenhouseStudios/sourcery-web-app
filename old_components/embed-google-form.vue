<template>
  <iframe
    :src="link"
    :width="width"
    :height="height"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
  >Loading…</iframe>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '1301'
        },
        link: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
iframe {
    background-color: white;
}
</style>
