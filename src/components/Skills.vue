<template>
    <div class="skills-container" ref="containerRef">
        <div class="skills-wrapper">
            <h2 class="section-title">Tech Stack</h2>
            <div class="track-scroll-wrapper">
                <div class="skills-track" ref="trackRef">
                    <div v-for="skill in skills" :key="skill.name" class="skill-card" @mouseenter="showSkillText(skill.name)"
                        @mouseleave="hideSkillText">
                        <div class="skill-icon">
                            <img :src="skill.icon" :alt="skill.name">
                        </div>
                        <span class="skill-name">{{ skill.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const containerRef = ref(null);
const trackRef = ref(null);
let mm = gsap.matchMedia();

const skills = ref([
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" },
    { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
    { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
    { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
    { name: ".NET", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg" }
]);

const showSkillText = (text) => {
    window.dispatchEvent(new CustomEvent("show_particle_text", {
        detail: { text: text, layout: 'top' }
    }));
};

const hideSkillText = () => {
    window.dispatchEvent(new Event("hide_particle_text"));
};

onMounted(async () => {
    await nextTick();
    
    // Use matchMedia for responsive animations
    mm.add("(min-width: 769px)", () => {
        const track = trackRef.value;
        
        const getScrollAmount = () => {
            let amount = track.scrollWidth - window.innerWidth;
            return -(amount > 0 ? amount + 100 : 0); // Add small buffer
        };

        // Horizontal Scroll Animation (Desktop Only)
        gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.value,
                start: "top top", // Pin when top hits top
                end: () => `+=${Math.abs(getScrollAmount()) * 0.6}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Title Animation
        gsap.fromTo('.section-title',
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: containerRef.value,
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            }
        );
    });

    // Mobile-specific animations (optional, or just let it be native scroll)
    mm.add("(max-width: 768px)", () => {
        gsap.fromTo('.section-title',
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: containerRef.value,
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 0.8
            }
        );
    });
});

onUnmounted(() => {
    clearTimeout(debounceTimer);
    mm.revert(); // Clean up matchMedia
});
</script>

<style scoped>
.skills-container {
    /* Make it full height to ensure clean pinning */
    height: 100vh; 
    width: 100%;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.skills-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.section-title {
    font-family: "Satoshi", sans-serif;
    font-size: clamp(2rem, 5vw, 4rem);
    color: var(--primary-color);
    margin-bottom: 4rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    padding-left: 10vw; /* Align with start of track */
}

.skills-track {
    display: flex;
    gap: 3rem;
    padding-left: 10vw; /* Start slightly indented */
    padding-right: 10vw;
    width: max-content; /* Ensure track takes up full width of children */
}

.skill-card {
    width: 250px;
    height: 250px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(10px);
    flex-shrink: 0;
    gap: 1.5rem;
}

.skill-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.skill-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* Optional: make icons white if you prefer monochrome */
    /* filter: grayscale(100%) brightness(200%); */
}

.skill-card:hover .skill-icon {
    transform: scale(1.1) rotate(5deg);
}

.skill-card:hover {
    background: var(--primary-color);
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 20px 40px rgba(158, 255, 237, 0.2);
    border-color: var(--primary-color);
}

.skill-name {
    font-family: "Satoshi", sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    transition: color 0.3s ease;
}

.skill-card:hover .skill-name {
    color: #000;
}

.track-scroll-wrapper {
    width: 100%;
}

@media (max-width: 768px) {
    .skills-container {
        height: auto;
        padding: 4rem 0;
        display: block;
        overflow: visible;
    }

    .track-scroll-wrapper {
        overflow: visible;
        padding-bottom: 0;
    }
       
    .skill-card {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        padding: 1rem;
        gap: 1rem;
    }

    .skill-icon {
        width: 50px;
        height: 50px;
    }
    
    .skill-name {
        font-size: 1.1rem;
    }
    
    .skills-track {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 0 1.5rem;
        width: 100%;
    }

    .section-title {
        padding-left: 1.5rem;
        margin-bottom: 2rem;
    }
}
</style>
