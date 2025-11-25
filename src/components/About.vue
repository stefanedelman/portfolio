<template>
    <div class="about-container">
        <div class="content-wrapper">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="text-column">
                    <div class="profile-photo">
                        <a href="https://linkedin.com/in/stefan-edelman" target="_blank" rel="noopener noreferrer">
                            <img src="/portrait.JPG" alt="Stefan Edelman">
                        </a>
                    </div>
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
                            <span class="social-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </span>
                            <span>GitHub</span>
                        </a>
                        <a @mouseover="isHover = true" @mouseleave="isHover = false"
                            href="https://linkedin.com/in/stefan-edelman" target="_blank" rel="noopener noreferrer"
                            class="social-link">
                            <span class="social-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </span>
                            <span>LinkedIn</span>
                        </a>
                        <a @mouseover="isHover = true" @mouseleave="isHover = false"
                            href="https://instagram.com/stefan_edelman" target="_blank" rel="noopener noreferrer"
                            class="social-link">
                            <span class="social-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </span>
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
import { ref, watch, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

onMounted(async () => {
    await nextTick();

    gsap.fromTo('.about-container .section-title', 
        {
            y: 50,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.about-container',
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }
    );

    gsap.fromTo('.profile-photo', 
        {
            scale: 0.8,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 85%',
            },
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'back.out(1.7)'
        }
    );

    gsap.fromTo('.bio', 
        {
            y: 30,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            delay: 0.2,
            ease: 'power3.out'
        }
    );

    gsap.fromTo('.skills-column', 
        {
            x: 50,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 85%',
            },
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.4,
            ease: 'power3.out'
        }
    );
});
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

.profile-photo {
    width: 200px;
    height: 200px;
    margin-bottom: 2rem;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--primary-color);
    box-shadow: 0 0 20px rgba(158, 255, 237, 0.3);
}

.profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
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
    display: flex;
    align-items: center;
    justify-content: center;
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
