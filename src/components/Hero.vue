<template>
    <div class="hero-wrapper">
        <div class="hero-content">
            <div class="title">
                <div class="title-part">
                    STEFAN
                </div>
                <div class="title-part">
                    EDELMAN
                </div>
                <div class="title-part" style="margin-top: 6rem;">
                    SOFTWARE ENGINEER
                </div>
            </div>

            <div class="buttons">
                <button class="button1" @mouseover="isHover = true" @mouseleave="isHover = false"
                    @click="scrollToSection('projects')">
                    View Projects
                </button>

                <button class="button2" @mouseover="isHover = true" @mouseleave="isHover = false"
                    @click="scrollToSection('contact')">
                    Contact Me
                </button>
            </div>
        </div>

        <div class="hero-image">
            <a href="https://linkedin.com/in/stefan-edelman" target="_blank" rel="noopener noreferrer">
                <img src="/portrait.JPG" alt="Stefan Edelman">
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

const isHover = ref(false)

onMounted(async () => {
    await nextTick();

    const tl = gsap.timeline()
    const isMobile = window.matchMedia("(max-width: 1280px)").matches;

    if (isMobile) {
        // Mobile Sequence: Image (Top) -> Text -> Buttons
        tl.fromTo('.hero-image', 
            {
                y: 50,
                opacity: 0,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out'
            }
        )
        .fromTo('.title-part', 
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out'
            }, '-=0.8'
        )
        .fromTo('.buttons button', 
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            }, '-=0.6')
    } else {
        // Desktop Sequence: Text -> Buttons -> Image (Side)
        tl.fromTo('.title-part', 
            {
                y: 100,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out'
            }
        )
        .fromTo('.buttons button', 
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            }, '-=0.5')
        .fromTo('.hero-image', 
            {
                x: 100,
                opacity: 0,
                scale: 0.9
            },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out'
            }, '-=0.8')
    }
})

watch(isHover, (newVal) => {
    if (newVal === true) {
        window.dispatchEvent(new Event("excite_particles"))
    }
    else {
        window.dispatchEvent(new Event("normalize_particles"))

    }
})

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
</script>

<style scoped>
* {
    font-family: "Satoshi", sans-serif;

}

.hero-wrapper {
    padding: 0 4rem;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4rem;
}

.hero-content {
    flex: 1;
    z-index: 2;
}

.hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.hero-image img {
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    border: 1px solid rgba(158, 255, 237, 0.2);
    transition: all 0.5s ease;
    object-fit: cover;
}

.hero-image img:hover {
    transform: scale(1.02) rotate(2deg);
    border-color: var(--primary-color);
    box-shadow: 0 30px 60px rgba(158, 255, 237, 0.1);
}

.title {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-weight: 700;
    line-height: 1.1;
}

.title-part {
    font-size: clamp(3rem, 8vw, 7rem);
    color: var(--primary-color);
}

.buttons {
    display: flex;
    gap: 2rem;
    margin-top: 4rem;
}

.buttons .button1,
.buttons .button2 {
    padding: 2rem 4rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    font-size: 2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.buttons .button1:hover,
.buttons .button2:hover {
    background: var(--primary-color);
    color: #000;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(158, 255, 237, 0.3);
}

@media (max-width: 1280px) {
    .hero-wrapper {
        flex-direction: column-reverse;
        justify-content: center;
        text-align: center;
        padding-top: 100px;
    }

    .hero-image {
        margin-bottom: 2rem;
    }

    .hero-image img {
        max-width: 450px;
        width: 80%;
    }

    .buttons {
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .buttons .button1,
    .buttons .button2 {
        padding: 1.5rem 3rem;
        font-size: 1.5rem;
    }
}

</style>