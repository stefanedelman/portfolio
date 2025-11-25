<template>
    <div class="contact-container" id="contact">
        <div class="content-wrapper">
            <h2 class="section-title">Get In Touch</h2>
            <p class="subtitle">Have a project in mind? Let's build something together.</p>

            <form @submit.prevent="submitForm" class="contact-form">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" v-model="form.name" :class="{ 'error': errors.name }"
                        placeholder="Your Name">
                    <span class="error-msg" v-if="errors.name">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="form.email" :class="{ 'error': errors.email }"
                        placeholder="your@email.com">
                    <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" v-model="form.message" :class="{ 'error': errors.message }" rows="5"
                        placeholder="Tell me about your project..."></textarea>
                    <span class="error-msg" v-if="errors.message">{{ errors.message }}</span>
                </div>

                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                    <span v-if="!isSubmitting">Send Message</span>
                    <span v-else>Sending...</span>
                </button>

                <div v-if="submitStatus" :class="['status-msg', submitStatus.type]">
                    {{ submitStatus.message }}
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const form = reactive({
    name: '',
    email: '',
    message: ''
});

const errors = reactive({});
const isSubmitting = ref(false);
const submitStatus = ref(null);

const validate = () => {
    errors.name = !form.name ? 'Name is required' : '';
    errors.email = !form.email ? 'Email is required' : !/^\S+@\S+\.\S+$/.test(form.email) ? 'Invalid email' : '';
    errors.message = !form.message ? 'Message is required' : '';

    return !errors.name && !errors.email && !errors.message;
};

const submitForm = async () => {
    if (!validate()) return;

    isSubmitting.value = true;
    submitStatus.value = null;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || serviceId === 'your_service_id') {
        console.error('EmailJS not configured. Please set VITE_EMAILJS_SERVICE_ID in .env');
        submitStatus.value = {
            type: 'error',
            message: 'Email service not configured. Please contact the developer.'
        };
        isSubmitting.value = false;
        return;
    }

    try {
        await emailjs.send(
            serviceId,
            templateId,
            {
                from_name: form.name,
                from_email: form.email,
                message: form.message,
                to_name: 'Stefan' // Optional, depends on template
            },
            publicKey
        );

        submitStatus.value = {
            type: 'success',
            message: 'Message sent successfully! I will get back to you soon.'
        };

        // Reset form
        form.name = '';
        form.email = '';
        form.message = '';

        // Clear success message after 5 seconds
        setTimeout(() => {
            submitStatus.value = null;
        }, 5000);

    } catch (error) {
        console.error('EmailJS Error:', error);
        submitStatus.value = {
            type: 'error',
            message: 'Failed to send message. Please try again later.'
        };
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    await nextTick();

    gsap.fromTo('.contact-container .section-title', 
        {
            y: 50,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.contact-container',
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }
    );

    gsap.fromTo('.subtitle', 
        {
            y: 30,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.contact-container',
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        }
    );

    gsap.fromTo('.contact-form', 
        {
            y: 50,
            opacity: 0
        },
        {
            scrollTrigger: {
                trigger: '.contact-container',
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.4,
            ease: 'power3.out'
        }
    );
});
</script>

<style scoped>
.contact-container {
    padding: 6rem 4rem;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
}

.content-wrapper {
    max-width: 600px;
    width: 100%;
}

.section-title {
    font-family: "Satoshi", sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    color: var(--primary-color);
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    text-align: center;
}

.subtitle {
    font-family: "Satoshi", sans-serif;
    color: #ccc;
    text-align: center;
    margin-bottom: 3rem;
    font-size: 1.2rem;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    padding: 3rem;
    border-radius: 24px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-family: "Satoshi", sans-serif;
    color: #fff;
    font-size: 0.9rem;
    margin-left: 0.5rem;
}

input,
textarea {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    color: #fff;
    font-family: "Satoshi", sans-serif;
    font-size: 1rem;
    transition: all 0.3s ease;
    outline: none;
}

input:focus,
textarea:focus {
    border-color: var(--primary-color);
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.1);
}

input.error,
textarea.error {
    border-color: #ff4444;
}

.error-msg {
    color: #ff4444;
    font-size: 0.8rem;
    margin-left: 0.5rem;
    font-family: "Satoshi", sans-serif;
}

.submit-btn {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(158, 255, 237, 0.1);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: 50px;
    font-family: "Satoshi", sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.submit-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(158, 255, 237, 0.3);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.status-msg {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    font-family: "Satoshi", sans-serif;
}

.status-msg.success {
    background: rgba(0, 255, 136, 0.1);
    color: #00ff88;
    border: 1px solid #00ff88;
}

.status-msg.error {
    background: rgba(255, 68, 68, 0.1);
    color: #ff4444;
    border: 1px solid #ff4444;
}

@media (max-width: 768px) {
    .contact-container {
        padding: 4rem 1rem;
    }

    .contact-form {
        padding: 1.5rem;
    }
}
</style>
