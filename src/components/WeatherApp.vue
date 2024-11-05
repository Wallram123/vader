<template>
  <template v-if="!currentLocation">
      <h2 class="ruta">Angiven plats saknas</h2>
      <p>Vi kunde inte hämta din plats. Se till att ge webbläsaren behörighet att använda din plats.</p>
  </template>
  <template v-else>
      
  </template>
</template>

<script setup>
import { watchEffect, ref } from 'vue';
import { createMap } from '@/services/ForecastService';

const props = defineProps(['location']);
const currentLocation = ref(null);
let mapInstance = null; // Håll en referens till kartinstansen

// Observerar förändringar i platshanteringen
watchEffect(() => {
  const locationsList = JSON.parse(localStorage.getItem('locations'));
  
  // Hitta plats baserat på props
  if (props.location) {
      currentLocation.value = locationsList?.find(loc => loc.name.toLowerCase() === props.location.toLowerCase());
  } else {
      currentLocation.value = locationsList?.find(loc => loc.default);
  }

  // Om plats finns uppdatera eller skapa
  if (currentLocation.value && currentLocation.value.position) {
      if (mapInstance) {
          // Om kartan redan finns uppdatera den
          mapInstance.setView([currentLocation.value.position.lat, currentLocation.value.position.long]);
      } else {
          // Skapa kartan 
          mapInstance = createMap(currentLocation.value.position.lat, currentLocation.value.position.long);
      }
  } else {
      console.log("Platsen eller dess position är inte definierad.");
      // Rensa kartinstansen om platsen inte är definierad
      if (mapInstance) {
          mapInstance.remove(); // Ta bort kartan
          mapInstance = null; // Rensa
      }
  }
});
</script>

<style scoped>
.ruta {
  text-align: center;              
  padding: 10px;                   
  max-width: 600px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;       
}

.ruta h2,
.ruta p {
  display: flex;                   
  align-items: center;             
  justify-content: center;         
  margin: 0;                       
}
</style>
