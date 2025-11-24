<script setup>
import Hero from './components/Hero.vue';
import ParticleBackground from './components/ParticleBackground.vue';

</script>

<template>
<ParticleBackground class="background"/>
<Hero class="hero" /> 



</template>

<style scoped>

.background{
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1000;
}


</style>
