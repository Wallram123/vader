<script setup>
const props = defineProps(['forecast'])
import { ref } from 'vue';
import wc from "@/assets/data/weather.json"
const weatherCodes = ref(wc)

function getText(code) {
    let wcText = weatherCodes.value.find(itm => {
        return itm.code == code
    }).description ?? 'Unknown'
    return wcText
}
</script>

<template>
    <ul>
        <li>Date</li>
        <li>Temp</li>
        <li>Precip</li>
        <li>Wind</li>

    </ul>
    <ul v-for="day in props.forecast.weather" :key="day">
        <li>{{ new Date(day.date).getDate() }}.{{ new Date(day.date).getMonth()+1 }} <br>
        {{ getText(day.code) }}</li>
        <li>{{ day.temp.min }} -<br> {{ day.temp.max }}{{ day.temp.unit }}</li>
        <li>{{ day.precipitation.sum }}{{ day.precipitation.unit }}<br>({{ day.precipitation.probability }}%)</li>
        <li>{{ Math.round(day.wind.speed) }}({{ Math.round(day.wind.gusts) }}){{ day.wind.unit }}<br>{{ day.wind.direction }}{{ day.wind.direction.unit }}</li>
    </ul>
</template>
<style scoped>
/* Grundlayout för väderlistan */
ul {
    padding: 0;
    display: grid;
    grid-template-columns: 15% 15% 25% 20% auto;
    max-width: 600px;
    margin: 20px auto; /* Centrera listan på sidan */
    font-family: Arial, sans-serif;
    border-radius: 8px;
    overflow: hidden; /* Rundade hörn */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Lätt skugga runt listan */
}

/* Växlande bakgrundsfärger för rader */
ul:nth-child(even) {
    background-color: #e0f7fa; /* Ljus cyan för jämna rader */
}
ul:nth-child(odd) {
    background-color: #f1f8e9; /* Ljus grön för udda rader */
}

/* Stilsättning för varje väderpost */
li {
    padding: 10px;
    list-style-type: none;
    text-align: center;
    font-size: 1em;
    color: #333;
    transition: background-color 0.3s ease;
}

/* Hover-effekt för varje väderpost */
li:hover {
    background-color: #c8e6c9; /* Ljusare grön ton vid hover */
}

/* Standardstil för varje datum eller text */
li span {
    font-weight: bold;
    color: #00796b; /* Mörk teal för text */
}

/* Specifik stil för "default" väderpost */
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
    background-color: #ef5350; /* Mörkare röd vid hover */
}

/* Divider för att separera väderposter */
.rad {
    width: 80%;
    height: 2px;
    background-color: #ccc;
    margin: 10px auto;
}

/* Knappstil */
button {
    font-weight: bold;
    background-color: #4db6ac;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
}

button:hover {
    background-color: #00897b; /* Mörkare teal vid hover */
}

/* Centrering av text */
.weather-info {
    text-align: center;
    color: #00796b;
    font-size: 1.2em;
}


</style>

