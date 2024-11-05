import { createRouter, createWebHistory } from 'vue-router'
import ForecastView from '../views/ForecastView.vue'
import CurrentWeather from '@/components/CurrentWeather.vue'; 


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ForecastView,
    },
    {
      path: '/Location',
      name: 'location',
      component: () => import('@/views/LocationView.vue'),
    },
    {
      path: '/forecast/:location',
      name: 'forecast',
      component: ForecastView,
      props: true,
    },
    {
      path: '/currentweather/:location',
      name: 'currentweather',
      component: CurrentWeather,
      props: true,
    },
  
  /*  {
      path: '/about', 
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
 */ ],
})

export default router
