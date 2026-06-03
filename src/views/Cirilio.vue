<template>
    <div class="project-page">
        <div class="back-button" @click="$router.push('/')">
            &larr; Back
        </div>

        <div class="content-container">
            <div class="text-column">
                <div class="scroll-section" data-index="0" :class="{ active: currentImageIndex === 0 }">
                    <h1 class="project-title">Cirilio</h1>
                    <div class="project-meta">
                        <span class="tag">Vue 3</span>
                        <span class="tag">TypeScript</span>
                        <span class="tag">Express</span>
                        <span class="tag">Supabase</span>
                        <span class="tag">Prisma</span>
                    </div>
                    <p>
                        Cirilio is a Serbian language learning app built around spaced repetition, Cyrillic support,
                        guided lessons, daily reviews, subscriptions, rewards, and content editing tools. The app has
                        already seen 100+ user signups.
                    </p>

                    <div class="project-actions">
                        <a href="https://www.cirilio.com" target="_blank" rel="noopener noreferrer" class="visit-btn">
                            Visit Live Site
                        </a>
                    </div>

                    <div class="mobile-image" @click="openLightbox('/cirilio-dashboard.png')">
                        <img src="/cirilio-dashboard.png" alt="Cirilio dashboard screenshot">
                    </div>
                </div>

                <div class="scroll-section" data-index="1" :class="{ active: currentImageIndex === 1 }">
                    <h3>The Challenge</h3>
                    <p>
                        Serbian learners need a focused path through vocabulary, pronunciation, and two alphabets
                        without turning practice into a heavy daily commitment.
                    </p>

                    <div class="mobile-image" @click="openLightbox('/cirilio-lesson.png')">
                        <img src="/cirilio-lesson.png" alt="Cirilio lesson screenshot">
                    </div>
                </div>

                <div class="scroll-section" data-index="2" :class="{ active: currentImageIndex === 2 }">
                    <h3>The Solution</h3>
                    <p>
                        The app combines a Vue and TypeScript frontend with an Express API, Supabase auth and storage,
                        Prisma-backed data modeling, and structured lesson and review flows.
                    </p>

                    <div class="mobile-image" @click="openLightbox('/cirilio-shop.png')">
                        <img src="/cirilio-shop.png" alt="Cirilio shop screenshot">
                    </div>
                </div>

                <div class="scroll-section" data-index="2" :class="{ active: currentImageIndex === 2 }">
                    <h3>Key Features</h3>
                    <ul>
                        <li>Spaced repetition reviews for Serbian vocabulary</li>
                        <li>100+ user signups</li>
                        <li>Latin and Cyrillic learning paths</li>
                        <li>Lesson, review, leaderboard, shop, and rewards systems</li>
                        <li>Editor tools for managing learning content</li>
                    </ul>

                    <div class="mobile-image" @click="openLightbox('/cirilio-shop.png')">
                        <img src="/cirilio-shop.png" alt="Cirilio shop screenshot">
                    </div>
                </div>
            </div>

            <div class="image-column">
                <div class="image-wrapper">
                    <div v-for="(img, index) in images" :key="index" class="project-image landscape"
                        :class="{ active: currentImageIndex === index }" @click="openLightbox(img.src)">
                        <img :src="img.src" :alt="img.alt">
                    </div>
                </div>
            </div>
        </div>

        <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
            <div class="lightbox-content">
                <img :src="lightboxImage" alt="Full size preview">
            </div>
            <button class="close-btn" @click="closeLightbox">x</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const images = ref([
    { src: '/cirilio-dashboard.png', alt: 'Cirilio dashboard screenshot' },
    { src: '/cirilio-lesson.png', alt: 'Cirilio lesson screenshot' },
    { src: '/cirilio-shop.png', alt: 'Cirilio shop screenshot' }
]);

const currentImageIndex = ref(0);
const lightboxOpen = ref(false);
const lightboxImage = ref('');
let observer = null;

const openLightbox = (src) => {
    lightboxImage.value = src;
    lightboxOpen.value = true;
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    lightboxOpen.value = false;
    document.body.style.overflow = '';
};

onMounted(async () => {
    if (window.innerWidth > 768) {
        window.dispatchEvent(new CustomEvent("show_particle_text", {
            detail: { text: "CIRILIO", layout: 'top' }
        }));
    } else {
        window.dispatchEvent(new Event("hide_particle_text"));
    }

    await nextTick();

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    currentImageIndex.value = index;
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0
    });

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });
});

onUnmounted(() => {
    window.dispatchEvent(new Event("hide_particle_text"));
    document.body.style.overflow = '';

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
    background: rgba(0, 0, 0, 0.5);
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
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0.3;
    transition: opacity 0.5s ease;
    padding: 2rem 0;
}

.scroll-section.active {
    opacity: 1;
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
    flex-wrap: wrap;
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

.scroll-section p,
.scroll-section ul {
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
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: zoom-in;
    background: #000;
}

.project-image.landscape {
    width: 100%;
    max-width: 860px;
    margin-left: 0;
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

.mobile-image {
    display: none;
}

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
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
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
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .project-page {
        padding-top: 80px;
    }

    .content-container {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 0 1.5rem;
    }

    .back-button {
        top: 1.5rem;
        left: 1.5rem;
        padding: 0.4rem 0.8rem;
        font-size: 1rem;
    }

    .text-column {
        padding-top: 0;
        padding-bottom: 2rem;
    }

    .project-title {
        font-size: 3rem;
    }

    .scroll-section {
        min-height: auto;
        margin-bottom: 3rem;
        opacity: 1;
        padding: 0;
    }

    .scroll-section h3 {
        font-size: 1.8rem;
    }

    .scroll-section p,
    .scroll-section ul {
        font-size: 1.1rem;
    }

    .image-column {
        display: none;
    }

    .mobile-image {
        display: block;
        width: 100%;
        margin-top: 2rem;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-image img {
        width: 100%;
        height: auto;
        display: block;
    }
}
</style>
