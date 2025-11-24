<script setup>
import Hero from './components/Hero.vue';
import ParticleBackground from './components/ParticleBackground.vue';
import Projects from './components/Projects.vue';
import About from './components/About.vue';
import Contact from './components/Contact.vue';

</script>

<template>
    <ParticleBackground class="background" />
    <Hero class="hero" />
    <About />
    <Projects id="projects" />
    <Contact id="contact" />

</template>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1000;
}
</style>
