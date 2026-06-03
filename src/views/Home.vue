<script setup>
import Hero from '../components/Hero.vue';
import Projects from '../components/Projects.vue';
import About from '../components/About.vue';
import Skills from '../components/Skills.vue';
import Contact from '../components/Contact.vue';
</script>

<template>
    <Hero class="hero" />
    <About />
    <Projects id="projects" />
    <Skills />
    <Contact id="contact" />
</template>
