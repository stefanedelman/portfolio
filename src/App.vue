<script setup>
import Hero from './components/Hero.vue';
import ParticleBackground from './components/ParticleBackground.vue';
import Projects from './components/Projects.vue';

</script>

<template>
<ParticleBackground class="background"/>
<Hero class="hero" /> 
<Projects id="projects" />
<div id="contact" style="height: 100vh;"></div> <!-- Placeholder for Contact -->

</template>

<style scoped>

.background{
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1000;
}


</style>
