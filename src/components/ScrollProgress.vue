<script setup>
defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0
  }
})
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<style scoped>
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  z-index: 10000;
  pointer-events: none;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: var(--primary-color, #9effed);
  transform-origin: 0 50%;
  transition: transform 0.1s ease-out;
  box-shadow: 0 0 10px var(--primary-color, #9effed);
}
</style>
