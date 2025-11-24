<template>
    <div class="about-container">
        <div class="content-wrapper">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="text-column">
                    <p class="bio">
                        Hello! I'm Stefan, a passionate software developer with a knack for creating immersive digital
                        experiences.
                        I specialize in building high-performance web applications that merge creativity with technical
                        precision.
                    </p>
                    <p class="bio">
                        With a background in both design and engineering, I strive to craft interfaces that are not only
                        functional
                        but also visually stunning and intuitive to use.
                    </p>
                    <div class="social-links">
                        <a @mouseover="isHover = true" @mouseleave="isHover = false"
                            href="https://github.com/stefanedelman" target="_blank" rel="noopener noreferrer"
                            class="social-link">
                            <span class="social-icon">→</span>
                            <span>GitHub</span>
                        </a>
                        <a @mouseover="isHover = true" @mouseleave="isHover = false"
                            href="https://linkedin.com/in/stefan-edelman" target="_blank" rel="noopener noreferrer"
                            class="social-link">
                            <span class="social-icon">→</span>
                            <span>LinkedIn</span>
                        </a>
                        <a @mouseover="isHover = true" @mouseleave="isHover = false"
                            href="https://instagram.com/stefan_edelman" target="_blank" rel="noopener noreferrer"
                            class="social-link">
                            <span class="social-icon">→</span>
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
                <div class="skills-column">
                    <h3 class="skills-title">Tech Stack</h3>
                    <ul class="skills-list">
                        <li v-for="skill in skills" :key="skill" @mouseenter="showSkillText(skill)"
                            @mouseleave="hideSkillText">
                            {{ skill }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const skills = ref([
    "Vue.js",
    "Node / ExpressJS",
    "Python",
    "Flask",
    "JavaScript",
    "HTML5 & CSS3",
    "MySQL",
    "Git & CI/CD",
    "PHP & Laravel",
    "C# & .NET"
]);

const isHover = ref(false)

watch(isHover, (newVal) => {
    if (newVal === true) {
        window.dispatchEvent(new Event("excite_particles"))
    }
    else {
        window.dispatchEvent(new Event("normalize_particles"))

    }
})

const showSkillText = (text) => {
    window.dispatchEvent(new CustomEvent("show_particle_text", {
        detail: { text: text, layout: 'sides' }
    }));
};

const hideSkillText = () => {
    window.dispatchEvent(new Event("hide_particle_text"));
};
</script>

<style scoped>
.about-container {
    padding: 6rem 4rem;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
}

.content-wrapper {
    max-width: 1200px;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 24px;
    padding: 4rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
    font-family: "Satoshi", sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    color: var(--primary-color);
    margin-bottom: 3rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
}

.about-content {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 4rem;
}

.bio {
    font-family: "Satoshi", sans-serif;
    font-size: 1.2rem;
    line-height: 1.8;
    color: #ddd;
    margin-bottom: 2rem;
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--primary-color);
    border-radius: 50px;
    color: var(--primary-color);
    text-decoration: none;
    font-family: "Satoshi", sans-serif;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: var(--primary-color);
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(158, 255, 237, 0.3);
}

.social-icon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.social-link:hover .social-icon {
    transform: translateX(3px);
}

.skills-title {
    font-family: "Satoshi", sans-serif;
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.skills-list {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
}

.skills-list li {
    font-family: "Satoshi", sans-serif;
    color: var(--primary-color);
    border: 1px solid rgba(var(--primary-rgb), 0.3);
    /* Fallback if var not defined */
    border: 1px solid var(--primary-color);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-align: center;
    font-size: 0.9rem;
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.skills-list li:hover {
    background: var(--primary-color);
    color: #000;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .about-container {
        padding: 4rem 2rem;
    }

    .content-wrapper {
        padding: 2rem;
    }
}
</style>
