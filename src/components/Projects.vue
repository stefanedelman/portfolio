<template>
    <div class="projects-container">
        <h2 class="section-title">Selected Works</h2>

        <div class="projects-grid">
            <div v-for="(project, index) in projects" :key="index" class="project-card" @mouseenter="showText"
                @mouseleave="hideText" @mousemove="updateScreenshotPosition">
                <div class="card-content">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <p class="project-desc">{{ project.description }}</p>
                    <div class="tags">
                        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                </div>

                <!-- Screenshot Preview -->
                <div v-if="showScreenshot && project.title === 'Lawcrative'" class="screenshot-preview"
                    :style="{ left: screenshotX + 'px', top: screenshotY + 'px' }">
                    <img src="/placeholder-lawcrative.png" alt="Lawcrative Screenshot">
                </div>
            </div>
        </div>

        <!-- Custom Cursor -->
        <div v-if="showCustomCursor" class="custom-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
            Learn more
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const projects = ref([
    {
        title: "Lawcrative",
        description: "A modern legal technology platform designed to streamline case management and client communication for law firms.",
        tags: ["Vue 3", "Expressjs", "MySQL"]
    }
]);

const showScreenshot = ref(false);
const screenshotX = ref(0);
const screenshotY = ref(0);
const cursorX = ref(0);
const cursorY = ref(0);
const showCustomCursor = ref(false);

const showText = () => {
    showScreenshot.value = true;
    showCustomCursor.value = true;
    window.dispatchEvent(new CustomEvent("show_particle_text", {
        detail: { text: "LAWCRATIVE", layout: 'bottom' }
    }));
};

const hideText = () => {
    showScreenshot.value = false;
    showCustomCursor.value = false;
    window.dispatchEvent(new Event("hide_particle_text"));
};

const updateScreenshotPosition = (event) => {
    screenshotX.value = event.clientX + 20;
    screenshotY.value = event.clientY + 20;
};

const handleMouseMove = (event) => {
    cursorX.value = event.clientX;
    cursorY.value = event.clientY;
};

onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove);
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
    gap: 2rem;
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
    flex-direction: column;
    justify-content: space-between;
    min-height: 250px;
    position: relative;
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
    transform: translate(-50%, -120%);
    white-space: nowrap;
}

.screenshot-preview {
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    padding: 0.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    transform: translate(0, 0);
}

.screenshot-preview img {
    width: 300px;
    height: auto;
    border-radius: 8px;
    display: block;
}

.project-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
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
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    font-family: "Satoshi", sans-serif;
    font-size: 0.8rem;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.2);
}
</style>
