<template>
    <div class="projects-container">
        <h2 class="section-title">Selected Works</h2>
        
        <div class="projects-grid">
            <div v-for="(project, index) in projects" :key="index" class="project-card">
                <div class="card-content">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <p class="project-desc">{{ project.description }}</p>
                    <div class="tags">
                        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const projects = ref([
    {
        title: "E-Commerce Dashboard",
        description: "A real-time analytics dashboard for online retailers, featuring data visualization and inventory management.",
        tags: ["Vue 3", "D3.js", "Firebase"]
    },
    {
        title: "AI Image Generator",
        description: "Web application that leverages stable diffusion models to generate unique artwork from text prompts.",
        tags: ["React", "Python", "TensorFlow"]
    },
    {
        title: "Crypto Portfolio Tracker",
        description: "Mobile-first application for tracking cryptocurrency investments across multiple wallets and exchanges.",
        tags: ["React Native", "Node.js", "Web3"]
    }
]);
</script>

<style scoped>
.projects-container {
    padding: 4rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1; /* Ensure it sits above background but below fixed overlays if any */
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
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 250px;
}

.project-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary-color);
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2); /* Assuming we might add RGB var later, or just use hex opacity */
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.1); /* Fallback glow */
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
