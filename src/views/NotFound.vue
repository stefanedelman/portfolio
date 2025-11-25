<template>
    <div class="not-found-container">
        <div class="content">
            <h1 class="error-code">404</h1>
            <h2 class="error-message">Page Not Found</h2>
            <p class="description">The page you are looking for doesn't exist or has been moved.</p>
            <router-link to="/" class="home-button">
                Return Home
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.not-found-container {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: white;
    font-family: 'Satoshi', sans-serif;
    text-align: center;
    padding: 20px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.error-code {
    font-size: 8rem;
    font-weight: 900;
    margin: 0;
    line-height: 1;
    color: var(--primary-color);
    opacity: 0.9;
}

.error-message {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
}

.description {
    font-size: 1.1rem;
    color: #888;
    max-width: 400px;
    margin: 0;
}

.home-button {
    margin-top: 1rem;
    padding: 12px 32px;
    background: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
}

.home-button:hover {
    background: var(--primary-color);
    color: #111;
}

@media (max-width: 768px) {
    .error-code {
        font-size: 6rem;
    }
    
    .error-message {
        font-size: 1.5rem;
    }
}
</style>
