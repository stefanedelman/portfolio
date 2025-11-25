<template>
    <div class="projects-container">
        <h2 class="section-title">Selected Works</h2>

        <div class="projects-grid">
            <div v-for="(project, index) in projects" :key="index" class="project-card" @mouseenter="showText(project)"
                @mouseleave="hideText" @click="navigateToProject(project)">

                <div class="card-content">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <p class="project-desc">{{ project.description }}</p>
                    <div class="tags">
                        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                </div>
                
                <div v-if="project.logo" class="project-logo">
                    <img :src="project.logo" :alt="project.title + ' Logo'">
                </div>
            </div>
        </div>

        <div v-if="hoveredProject && hoveredProject.images" class="project-preview-overlay">
            <div class="preview-images">
                <div v-for="(img, idx) in hoveredProject.images.slice(0, 3)" :key="idx" class="preview-image-wrapper" :style="{ '--delay': idx * 0.1 + 's' }">
                    <img :src="img" alt="Project Preview">
                </div>
            </div>
        </div>

        <div v-if="showCustomCursor" class="custom-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
            Learn more
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();

const projects = ref([
    {
        title: "Lawcrative",
        description: "A modern legal technology platform designed to streamline case management and client communication for law firms.",
        tags: ["Vue 3", "Expressjs", "MySQL"],
        slug: "lawcrative",
        logo: "/Lawcrative_Logo.png",
        images: [
            "/dashboard.png",
            "/Client Management.png",
            "/Promo Mobile.jpg"
        ]
    }
]);

const hoveredProject = ref(null);
const showCustomCursor = ref(false);
const cursorX = ref(0);
const cursorY = ref(0);

const navigateToProject = (project) => {
    if (project.slug) {
        router.push(`/project/${project.slug}`);
    }
};

const showText = (project) => {
    hoveredProject.value = project;
    showCustomCursor.value = true;
    // Dispatch event for your background particle system
    window.dispatchEvent(new CustomEvent("show_particle_text", {
        detail: { text: project.title.toUpperCase(), layout: 'bottom' }
    }));
};

const hideText = () => {
    hoveredProject.value = null;
    showCustomCursor.value = false;
    window.dispatchEvent(new Event("hide_particle_text"));
};

// Only track mouse for the custom cursor label
const handleMouseMove = (event) => {
    cursorX.value = event.clientX;
    cursorY.value = event.clientY;
};

onMounted(async () => {
    document.addEventListener('mousemove', handleMouseMove);

    await nextTick();

    gsap.fromTo('.projects-container .section-title', 
        {
            y: 50,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.projects-container',
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }
    );

    const cards = gsap.utils.toArray('.project-card');
    cards.forEach((card, index) => {
        gsap.fromTo(card, 
            {
                y: 50,
                opacity: 0
            },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1, // Manual stagger
                ease: 'power3.out'
            }
        );
    });
});

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.projects-container {
    padding: 4rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;
}

.section-title {
    font-family: "Satoshi", sans-serif;
    font-size: clamp(2rem, 5vw, 4rem);
    color: var(--primary-color);
    margin-bottom: 3rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 4rem;
    /* Increased gap slightly to make room for hover effects */
    width: 100%;
}

.project-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    transition: all 0.3s ease;
    cursor: none;
    display: flex;
    flex-direction: row; /* Changed to row */
    justify-content: space-between;
    align-items: flex-start; /* Align top */
    min-height: 250px;

    /* Critical for absolute positioning the screenshot */
    position: relative;
    z-index: 1;
}

.card-content {
    flex: 1;
    padding-right: 2rem;
}

/* Ensure the hovered card is on top of siblings so the popup isn't hidden */
.project-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
    z-index: 10;
}

.project-preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-images {
    display: flex;
    gap: 2rem;
    align-items: center;
    transform: translateY(-200px);
}

.preview-image-wrapper {
    width: 300px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid var(--primary-color);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeUp 0.4s ease forwards;
    animation-delay: var(--delay);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    background: #000;
}

.preview-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@keyframes fadeUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.custom-cursor {
    position: fixed;
    pointer-events: none;
    background: var(--primary-color);
    color: #000;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: "Satoshi", sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 9999;
    /* Centers cursor on mouse */
    transform: translate(-50%, -120%);
    white-space: nowrap;
}

.project-logo {
    flex-shrink: 0;
    margin-left: 1rem;
    height: 100%;
    display: flex;
    align-items: center;
}

.project-logo img {
    height: 220px; /* Significantly increased size */
    width: auto;
    object-fit: contain;
    border-radius: 16px;
    /* filter: brightness(0) invert(1); Removed filter in case logo is already correct color */
}

.project-title {
    font-family: "Satoshi", sans-serif;
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 1rem;
    font-weight: 600;
}

.project-desc {
    font-family: "Satoshi", sans-serif;
    color: #ccc;
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    font-family: "Satoshi", sans-serif;
    font-size: 1rem;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    padding: 0.4rem 1rem;
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.2);
}
</style>