<template>
    <div>
      <template v-if="!currentLocation">
        <h2 class="ruta">Angiven plats saknas</h2>
        <p>Vi kunde inte hämta din plats. Se till att ge webbläsaren behörighet att använda din plats.</p>
      </template>
      <template v-else>
        <h2 class="ruta">{{ currentLocation.name || 'Okänd plats' }}</h2>
        <p class="ruta">Lat: <span>{{ currentLocation.position.lat?.toFixed(3) }}</span></p>
        <p class="ruta">Long: <span>{{ currentLocation.position.long?.toFixed(3) }}</span></p>
  
        <!-- Visa väderinformation -->
        <CurrentWeather v-if="currentWeather" :forecast="currentWeather" />
        
        <h3 class="ruta" v-if="info">Kommande väderprognos</h3>
        <ForecastResult v-if="info" :forecast="info" />
        
        <!-- Kartbehållare -->
        <div id="mapContainer" style="height: 400px; width: 100%;"></div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { watchEffect, ref } from 'vue';
  import { getForecast, getCurrentWeather, createMap } from '@/services/ForecastService';
  import ForecastResult from '@/components/ForecastResult.vue';
  import CurrentWeather from '@/components/CurrentWeather.vue'; 
  
  const props = defineProps(['location']);
  const currentLocation = ref(null);
  const currentWeather = ref(null);
  const info = ref({});
  let mapInstance = null;
  
  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      return data?.display_name || "Okänd plats";
    } catch (error) {
      console.error("Kunde inte hämta platsnamn:", error);
      return "Fel vid hämtning";
    }
  };
  
  // Laddar väderdata och uppdaterar kartan baserat på platsen
  watchEffect(async () => {
    const locationsList = JSON.parse(localStorage.getItem('locations')) || [];
  
    if (props.location) {
      currentLocation.value = locationsList.find(loc => loc.name.toLowerCase() === props.location.toLowerCase());
    } else {
      currentLocation.value = locationsList.find(loc => loc.default);
    }
  
    if (currentLocation.value && currentLocation.value.position) {
      currentLocation.value.name = await fetchLocationName(currentLocation.value.position.lat, currentLocation.value.position.long);
  
      // Skapar eller uppdaterar kartan
      if (!mapInstance) {
        mapInstance = createMap(currentLocation.value.position.lat, currentLocation.value.position.long);
      } else {
        mapInstance.setView([currentLocation.value.position.lat, currentLocation.value.position.long]);
      }
  
      // Hämtar väderprognos
      try {
        const forecastResponse = await getForecast(currentLocation.value);
        info.value = forecastResponse;
        console.log("Forecast data:", forecastResponse); // Kontrollera om info uppdateras
      } catch (err) {
        console.log('Error fetching forecast:', err);
      }
  
      // Hämtar nuvarande väder
      try {
        const weatherResponse = await getCurrentWeather(currentLocation.value);
        currentWeather.value = weatherResponse; 
        console.log("Current weather data:", weatherResponse); // Kontrollera om currentWeather uppdateras
      } catch (err) {
        console.log('Error fetching current weather:', err);
      }
    } else {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null; 
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
  