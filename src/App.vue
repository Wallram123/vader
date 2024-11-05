<script setup>
import { onMounted, ref } from 'vue';
import BurgerMenu from './components/BurgerMenu.vue';
import MapComponent from './components/MapComponent.vue';
import WeatherApp from './components/WeatherApp.vue';

const menuActive = ref(false);
const location = ref({ lat: null, long: null });

onMounted(() => {
  let Location = JSON.parse(localStorage.getItem("Location"));
  if (!Location) {
    Location = [{ name: 'Mariehamn', position: { lat: 60, long: 20 }, default: true }];
    localStorage.setItem('Location', JSON.stringify(Location));
  }

  // Hämta positionen från lagringen
  location.value = Location[0].position; // Använd den första platsen som standard
});
</script>

<template>
  <div id="app">
    <WeatherApp />
    <header>
      <BurgerMenu @toggle-menu="menuActive = !menuActive" :active="menuActive" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/Location">Location</RouterLink>      
      </nav>
    </header>
    <!-- Skicka latitud och longitud till MapComponent -->
    <MapComponent :latitude="location.lat" :longitude="location.long" />
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>