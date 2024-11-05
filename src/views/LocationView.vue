<script setup>
import { onMounted, ref } from 'vue'
import  router  from '@/router'
import { getPosition } from '@/services/positioningService';

const location = ref({
  name: '',
  position: { lat: 0, long: 0 },
  default: false
})

const locationsList = ref([])

onMounted(() => {
    locationsList.value = JSON.parse(localStorage.getItem("locations"))
    let current = locationsList.value.find(loc => {
        return loc.name === "Current location"
    })
    if (!current) {
        current = { name: "Current location", position: { lat: 0, long: 0 }, default: false }
        locationsList.value.unshift(current)
    }

    getPosition()
        .then(response => {
            current.position = response.position
            let index = locationsList.value.findIndex(loc => {
                return loc.name === "Current location";
            })
            locationsList.value.splice(index, 1, current)
        })
        .catch(err=> {
            let index = locationsList.value.findIndex(loc => {
                return loc.name === "current location";
            })
            locationsList.value.splice(index, 1);
            console.log(err)
        })
})

function additem() {
    let newItem = {
      name: location.value.name,
      position: { lat: location.value.position.lat, long: location.value.position.long },
      default: true
    
  };

 const hasDefault = locationsList.value.some(loc => loc.default);
  if (!hasDefault) {
    newItem.default = true; 
  }
  locationsList.value.push(newItem);  
  localStorage.setItem("locations", JSON.stringify(locationsList.value))

}

function radera(loc) {
  locationsList.value = locationsList.value.filter((obj) => obj !== loc)
  localStorage.setItem("locations", JSON.stringify(locationsList.value))
}

function reset() {
  location.value.name = ''
  location.value.position.lat = 0
  location.value.position.long = 0
  localStorage.setItem("locations", JSON.stringify(locationsList.value))
}

function DefaultLoc(loc) {
  locationsList.value.forEach((location) => {
    location.default = false 
  })
  loc.default = true 
  localStorage.setItem("locations", JSON.stringify(locationsList.value))
  router.push(`/forecast/${loc.name}`)
}

</script>

<template>
    <h2>Locations</h2>
    <div class="input-container">
        <label>Namn: <input type="text" v-model="location.name" /></label>
        <label>
            Lat:
            <input type="number" max="90" min="-90" step=".1" size="5" v-model="location.position.lat" />
        </label>
        <label>
            Long:
            <input type="number" max="180" min="-180" step=".1" size="8" v-model="location.position.long" />
        </label>
    </div>
    <button v-on:click="additem">Save</button>
    <button @click="reset">Reset</button>
    <hr />
    <h3>List</h3>
    <ul>
      <li
        v-for="loc in locationsList"
        :key="loc.name"
        :class="['rad', loc.default ? 'default' : '']"
      >
        <span @click="DefaultLoc(loc)">
          {{ loc.name }},
        </span>
        ({{ Math.abs(loc.position.lat).toFixed(2) }}°{{ loc.position.lat > 0 ? 'N' : 'S' }}
        {{ Math.abs(loc.position.long).toFixed(2) }}°{{ loc.position.long > 0 ? 'E' : 'W' }})
        <span class="Radera" @click="radera(loc)" v-show="loc.name != 'Current location'">x</span>
      </li>
    </ul>
</template>

<style scoped>
/* Grundlayout för platser */


/* Växlande bakgrundsfärger för rader */
li:nth-child(even) {
    background-color: #e0f7fa; /* Ljus cyan för jämna rader */
}
li:nth-child(odd) {
    background-color: #f1f8e9; /* Ljus grön för udda rader */
}

/* Stilsättning för varje plats */
li {
    padding: 15px;  
    margin-bottom: 20px;
    list-style-type: none;
    text-align: center;
    font-size: 1.1em;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #333;
    transition: background-color 0.3s ease;
}



/* Hover-effekt för varje plats */
li:hover {
    background-color: #c8e6c9; /* Ljusare grön ton vid hover */
}

/* Standardstil för varje plats */
li span {
    font-weight: bold;
    color: #00796b; /* Mörk teal för text */
}

/* Specifik stil för "default" plats */
.default {
    background-color: #aed581; /* Mjuk grön färg för standard plats */
    font-weight: bold;
    color: #fff;
}

/* Stil för Radera-knappen */
.Radera {
    background-color: #e57373;
    color: white;
    font-weight: bold;
    padding: 0.3em 0.6em;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 5px;
}

.Radera:hover {
    background-color: #ef5350; 
}

button {
    font-weight: bold;
    background-color: #4db6ac;
    color: white;
    padding: 12px 20px; 
    border: none;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
    width: 100%;
}

button:hover {
    background-color: #00897b; 
}

/* Centrering av text */
h2, h3 {
    text-align: center;
    font-family: Arial, sans-serif;
    color: #333;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.input-container {
    background-color: #f9f9f9; /* Ljus bakgrundsfärg */
    padding: 20px; /* Utrymme inuti rutan */
    border-radius: 8px; /* Rundade hörn */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Skugga för djup */
    margin-bottom: 20px; /* Marginal under rutan */
}

.input-container label {
    display: block; /* Gör varje label och input till en blocknivå */
    margin-bottom: 10px; /* Utrymme mellan raderna */
}

.input-container input {
    padding: 10px; /* Inre padding för input-fält */
    border: 1px solid #ccc; /* Tunn grå kantlinje */
    border-radius: 4px; /* Rundade hörn för input-fält */
    width: calc(100% - 22px); /* Full bredd minus padding och border */
    box-sizing: border-box; /* Inkludera padding och border i totalbredd */
}
</style>