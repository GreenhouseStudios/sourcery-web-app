<template>
    <div class="top-callout-banner" v-if="show">
        <slot />
    </div>
</template>

<script setup>
defineProps({
  show: Boolean
})
</script>

<style scoped lang="scss">
.top-callout-banner {
    text-align: center;
    background-color: #3A2C42;
    padding: 18px 12px;
    font-weight: normal;
    font-size: 14px;

    background: linear-gradient(90deg, #4E4273 25%, #6A5690 50%, #4E4273 75%);
    background-size: 200% 100%;
    animation: shimmer 1s 1 forwards linear; /* Run once and keep final state */

    p {
        margin: 0;
        margin-bottom: 0;
    }
}

@keyframes shimmer {
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 140%;
  }
}
</style>