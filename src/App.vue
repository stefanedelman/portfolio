<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import ParticleBackground from './components/ParticleBackground.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute();
const showScrollTop = ref(false);
const scrollProgress = ref(0);
let lenis;

const scrollToTop = () => {
    lenis?.scrollTo(0);
};

watch(route, async () => {
    if (lenis) {
        lenis.stop();
        // Force native scroll to top immediately
        window.scrollTo(0, 0);
        await nextTick();
        lenis.scrollTo(0, { immediate: true });
        lenis.start();
    }
});

onMounted(() => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    lenis = new Lenis({
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
    lenis.on('scroll', (e) => {
        ScrollTrigger.update(e);
        showScrollTop.value = e.scroll > 500;
        scrollProgress.value = e.progress;
    });

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
    <ScrollProgress :progress="scrollProgress" />
    <ParticleBackground class="background" />
    <router-view />
    
    <button 
        class="scroll-to-top" 
        :class="{ 'visible': showScrollTop }" 
        @click="scrollToTop"
        aria-label="Scroll to top"
    >
        ↑
    </button>
</template>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1000;
}

.scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--primary-color);
    color: #000;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.scroll-to-top:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(158, 255, 237, 0.4);
}
</style>
