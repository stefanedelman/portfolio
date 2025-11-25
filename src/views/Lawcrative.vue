<template>
    <div class="project-page">
        <div class="back-button" @click="$router.push('/')">
            ← Back
        </div>
        
        <div class="content-container">
            <!-- Left Column: Scrollable Text -->
            <div class="text-column">
                <div class="scroll-section" data-index="0" :class="{ active: currentImageIndex === 0 }">
                    <div class="project-logo-container">
                        <img src="/Lawcrative_Logo.png" alt="Lawcrative Logo" class="project-logo">
                    </div>
                    <h1 class="project-title">Lawcrative</h1>
                    <div class="project-meta">
                        <span class="tag">Vue 3</span>
                        <span class="tag">Expressjs</span>
                        <span class="tag">MySQL</span>
                    </div>
                    <p>
                        Lawcrative is a modern legal technology platform designed to streamline case management and client communication for law firms.
                        It provides a comprehensive suite of tools for lawyers to manage their practice efficiently.
                    </p>
                    
                    <div class="project-actions">
                        <a href="https://www.lawcrative.com" target="_blank" rel="noopener noreferrer" class="visit-btn">
                            Visit Live Site ↗
                        </a>
                    </div>
                </div>
                
                <div class="scroll-section" data-index="1" :class="{ active: currentImageIndex === 1 }">
                    <h3>The Challenge</h3>
                    <p>
                        Legal professionals often struggle with fragmented systems for case management, billing, and client communication. 
                        The goal was to create a unified platform that handles all these aspects seamlessly while maintaining high security standards.
                    </p>
                </div>

                <div class="scroll-section" data-index="2" :class="{ active: currentImageIndex === 2 }">
                    <h3>The Solution</h3>
                    <p>
                        We built a robust single-page application using Vue 3 for the frontend, ensuring a snappy and responsive user experience.
                        The backend is powered by Express.js, providing a scalable API architecture.
                    </p>
                </div>

                <div class="scroll-section" data-index="3" :class="{ active: currentImageIndex === 3 }">
                    <h3>Key Features</h3>
                    <ul>
                        <li>Real-time case tracking</li>
                        <li>Secure document storage</li>
                        <li>Client portal for easy communication</li>
                        <li>Automated billing and invoicing</li>
                    </ul>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </div>

            <!-- Right Column: Sticky Images -->
            <div class="image-column">
                <div class="image-wrapper">
                    <div v-for="(img, index) in images" :key="index" 
                         class="project-image"
                         :class="[{ active: currentImageIndex === index }, img.type]"
                         @click="openLightbox(img.src)">
                        <img :src="img.src" :alt="`Project screenshot ${index + 1}`">
                    </div>
                </div>
            </div>
        </div>

        <!-- Lightbox Modal -->
        <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
            <div class="lightbox-content">
                <img :src="lightboxImage" alt="Full size preview">
            </div>
            <button class="close-btn" @click="closeLightbox">×</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const images = ref([
    { src: '/dashboard.png', type: 'landscape' },
    { src: '/Client Management.png', type: 'landscape' },
    { src: '/Calendar customization.png', type: 'landscape' },
    { src: '/Promo Mobile.jpg', type: 'portrait' }
]);

const currentImageIndex = ref(0);
const lightboxOpen = ref(false);
const lightboxImage = ref('');
let observer = null;

const openLightbox = (src) => {
    lightboxImage.value = src;
    lightboxOpen.value = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

const closeLightbox = () => {
    lightboxOpen.value = false;
    document.body.style.overflow = ''; // Restore scrolling
};

onMounted(async () => {
    // Trigger particle text
    window.dispatchEvent(new CustomEvent("show_particle_text", {
        detail: { text: "LAWCRATIVE", layout: 'bottom' }
    }));

    await nextTick();

    const options = {
        root: null,
        rootMargin: '-45% 0px -45% 0px', // Tighter trigger zone since sections are smaller
        threshold: 0
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    currentImageIndex.value = index;
                }
            }
        });
    }, options);

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });
});

onUnmounted(() => {
    // Reset particles
    window.dispatchEvent(new Event("hide_particle_text"));

    if (observer) {
        observer.disconnect();
    }
});
</script>

<style scoped>
.project-page {
    padding-top: 100px;
    min-height: 100vh;
    color: #fff;
    position: relative;
    z-index: 1;
}

.back-button {
    position: fixed;
    top: 2rem;
    left: 2rem;
    font-family: "Satoshi", sans-serif;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 100;
    padding: 0.5rem 1rem;
    background: rgba(0,0,0,0.5);
    border-radius: 8px;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
}

.back-button:hover {
    transform: translateX(-5px);
    background: rgba(158, 255, 237, 0.1);
}

.content-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

.text-column {
    padding-top: 10vh;
    padding-bottom: 25vh;
}

.scroll-section {
    min-height: 50vh; /* Reduced from 80vh to bring content closer */
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0.3;
    transition: opacity 0.5s ease;
    padding: 2rem 0; /* Add some padding for breathing room but keep sections closer */
}

/* Highlight the active section text too? Optional but nice */
/* We'd need to track active section in state for this, 
   but for now let's just keep it simple or use hover */
.scroll-section.active {
    opacity: 1;
}

.project-logo-container {
    margin-bottom: 1.5rem;
}

.project-logo {
    height: 100px;
    width: auto;
    object-fit: contain;
    border-radius: 12px;
}

.project-title {
    font-family: "Satoshi", sans-serif;
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
    line-height: 1;
}

.project-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
}

.tag {
    font-family: "Satoshi", sans-serif;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.9rem;
}

.project-actions {
    margin-top: 2rem;
}

.visit-btn {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: rgba(158, 255, 237, 0.1);
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    text-decoration: none;
    border-radius: 50px;
    font-family: "Satoshi", sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.visit-btn:hover {
    background: var(--primary-color);
    color: #000;
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(158, 255, 237, 0.3);
}

.scroll-section h3 {
    font-family: "Satoshi", sans-serif;
    color: #fff;
    margin-bottom: 1.5rem;
    font-size: 2.2rem;
}

.scroll-section p, .scroll-section ul {
    font-family: "Satoshi", sans-serif;
    font-size: 1.35rem;
    line-height: 1.8;
    color: #ddd;
    margin-bottom: 1.5rem;
}

.image-column {
    position: relative;
}

.image-wrapper {
    position: sticky;
    top: 10vh;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.project-image {
    position: absolute;
    opacity: 0;
    transform: scale(0.95) translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: zoom-in;
}

.project-image.landscape {
    width: 120%;
    max-width: 1000px;
    margin-left: 20px;
}

.project-image.portrait {
    width: auto;
    height: 80%; /* Make portrait images tall but not too wide */
    max-height: 700px;
}

.project-image.active {
    opacity: 1;
    transform: scale(1) translateY(0);
    z-index: 10;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (max-width: 768px) {
    .content-container {
        grid-template-columns: 1fr;
    }
    
    .image-wrapper {
        position: relative;
        top: 0;
        height: auto;
        margin-bottom: 2rem;
    }
    
    .project-image {
        position: relative;
        opacity: 1;
        transform: none;
        margin-bottom: 1rem;
    }
    
    .scroll-section {
        min-height: auto;
        margin-bottom: 4rem;
        opacity: 1;
    }
}

/* Lightbox Styles */
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    animation: fadeIn 0.3s ease;
}

.lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
}

.close-btn {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: none;
    border: none;
    color: #fff;
    font-size: 3rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    opacity: 0.7;
    transition: opacity 0.3s;
}

.close-btn:hover {
    opacity: 1;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
