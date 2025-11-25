import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Lawcrative from '../views/Lawcrative.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Stefan Edelman | Software Engineer',
      description: 'Portfolio of Stefan Edelman, a Software Engineer based in Belgrade specializing in fullstack development, database design and more. View my projects and resume.'
    }
  },
  {
    path: '/project/lawcrative',
    name: 'Lawcrative',
    component: Lawcrative,
    meta: {
      title: 'Lawcrative | Stefan Edelman',
      description: 'Lawcrative is a modern legal technology platform designed to streamline case management and client communication for law firms.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 Not Found | Stefan Edelman',
      description: 'The page you are looking for does not exist.'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Stefan Edelman | Software Engineer';
  
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', to.meta.description || 'Portfolio of Stefan Edelman, a Software Engineer based in Belgrade specializing in fullstack development, database design and more. View my projects and resume.');
  }

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', `https://www.stefanedelman.dev${to.path}`);
  }

  next();
});

export default router
