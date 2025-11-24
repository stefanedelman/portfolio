<template>
    <div class="hero-wrapper">
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
</template>

<script setup>
import { ref, watch } from 'vue'
const isHover = ref(false)

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
    margin-left: 4rem;
    margin-top: 15rem;
}

.title {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-weight: 700;
    /* super bold */
    line-height: 1.2;

}

.title-part {
    font-size: clamp(3rem, 12vw, 8rem);
    color: var(--primary-color);
}

.buttons {
    display: flex;
    width: 50%;
    justify-content: space-around;
    gap: 2rem;
    margin-top: 7rem;
}

.buttons .button1,
.buttons .button2 {
    padding: 60px 70px;
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    border: 1px var(--primary-color);
    border-radius: 10px;
    color: var(--primary-color);
    font-size: 50px;
}

.buttons .button1,
.buttons .button2 {
    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(3.7px);
    -webkit-backdrop-filter: blur(3.7px);
    border: 1px dashed var(--primary-color);
    transition: all 0.25s ease;


}


.buttons .button1:hover,
.buttons .button2:hover {
    background: var(--primary-color);
    color: black;
    box-shadow: 0 0 20px var(--primary-color);
    border-color: var(--primary-color);
}
</style>