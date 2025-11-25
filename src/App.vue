<script setup>
import { onMounted, onUnmounted } from 'vue';
import ParticleBackground from './components/ParticleBackground.vue';
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    })

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
    
    // Force refresh after a short delay to ensure layout is settled
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});
</script>

<template>
    <ParticleBackground class="background" />
    <router-view />
</template>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1000;
}
</style>
