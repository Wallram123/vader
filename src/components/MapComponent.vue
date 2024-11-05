<template>
    <div v-if="latitude && longitude" id="mapContainer" style="height: 400px; width: 100%;"></div>
    <div v-else class="ruta">
      <h2>Angiven plats saknas</h2>
      <p>Vi kunde inte hämta din plats. Se till att ge webbläsaren behörighet att använda din plats.</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, watch, ref } from 'vue';
  import { createMap } from '@/services/ForecastService';
  
  const props = defineProps({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  });
  
  let mapInstance = null;
  
  onMounted(() => {
    initializeMap();
  });
  
  // Funktion för att initiera kartan
  function initializeMap() {
    if (props.latitude && props.longitude) {
      // Skapa kartan med angivna latitud och longitud
      mapInstance = createMap(props.latitude, props.longitude);
    
    }
  }
  
  // Lyssna på ändringar av props och uppdatera kartan om positionen ändras
  watch(
    () => [props.latitude, props.longitude],
    ([newLat, newLong]) => {
      if (mapInstance) {
        mapInstance.setView([newLat, newLong]);
      }
    }
  );
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
  </style>
  