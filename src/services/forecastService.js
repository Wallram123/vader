import L from 'leaflet'; // Importerar Leaflet-biblioteket för att hantera kartor

// Denna funktion hämtar väderprognosen för en viss plats
export function getForecast(location) {
    // Skapar en ny Promise för att hantera asynkrona anrop
    return new Promise((resolve, reject) => {
        // Gör en hämtning (fetch) till väder-API:et med latitud och longitud
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.position.lat}&longitude=${location.position.long}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&wind_speed_unit=ms&timezone=auto`
        )
        .then(response => {
            // Om svaret från API:et inte är okej, kasta ett fel
            if (!response.ok) throw new Error(`API-fel: ${response.statusText}`);
            // Konvertera svaret till JSON-format
            return response.json();
        })
        .then(data => resolve(transformData(data))) // Om allt är okej, omvandla datan och skicka tillbaka den
        .catch(err => {
            // Om det uppstår ett fel, skriv ut felet i konsolen
            console.error('Fel vid hämtning av prognos:', err);
            reject(err); // Avvisa Promise med felet
        });
    });
}

// Denna funktion omvandlar data från apiet til en enklare funktion
function transformData(raw) {
    return {
        position: { 
            lat: raw.latitude, // Lagrar latitud
            long: raw.longitude // Lagrar longitud
        },
        timezone: {
            offset: raw.utc_offset_seconds, // Lagrar tidszonens förskjutning
            name: raw.timezone, // Lagrar namnet på tidszonen
            short: raw.timezone_abbreviation, // Lagrar förkortningen av tidszonen
        },
        // Omvandlar varje dag i väderdata till ett enklare objekt
        weather: raw.daily.time.map((date, i) => ({
            date, // Dagens datum
            code: raw.daily.weather_code[i], // Väderkod för dagen
            temp: {
                max: raw.daily.temperature_2m_max[i], // Max å min temperatur för dagen
                min: raw.daily.temperature_2m_min[i], 
                unit: raw.daily_units.temperature_2m_max, // Enhet för temperaturen
            },
            precipitation: {
                sum: raw.daily.precipitation_sum[i], // regn för dagen
                probability: raw.daily.precipitation_probability_max[i], // Sannolikhet för regn
                unit: raw.daily_units.precipitation_sum, // Enhet för regn
            },
            wind: {
                direction: raw.daily.wind_direction_10m_dominant[i], // Vindriktning för dagen
                direction_unit: raw.daily_units.wind_direction_10m_dominant, // Enhet för vindriktning
                speed: raw.daily.wind_speed_10m_max[i], // Max vindhastighet för dagen
                gusts: raw.daily.wind_gusts_10m_max[i], // Max vindbyar för dagen
                unit: raw.daily_units.wind_speed_10m_max, // Enhet för vindhastighe
            },
        }))
    };
}


// förhindra dubbletter
let mapInstance = null;

export function createMap(lat, long) {
    const mapElement = document.getElementById('mapContainer');
    if (!mapElement) {
        return;
    }

    if (mapInstance) {
        // Flytta kartan istället för att skapa en ny instans
        console.log('Updating existing map instance.');
        mapInstance.setView([lat, long], 13);
    } else {
        // Skapa en ny karta om ingen finns
        console.log('Creating new map instance.');
        mapInstance = L.map(mapElement).setView([lat, long], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        // Lägg till en markör på kartan
        L.marker([lat, long]).addTo(mapInstance)
            .bindPopup('Du är här!')
            .openPopup();
    }
}

// Funktion för att hämta nuvarande väder
export function getCurrentWeather(location) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.position.lat}&longitude=${location.position.long}&current_weather=true&temperature_unit=celsius`)
            .then(response => {
                if (!response.ok) throw new Error(`API error: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                console.log('Current Weather API Response:', data);
                resolve(transformCurrentWeather(data));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error);
            });
    });
}

// Transformerar apidatan för väderets info till ett enhetligt format
function transformCurrentWeather(raw) {
    const current = raw.current_weather;

    // visa varning om det saknas
    if (!current) {
        console.warn('Current weather data is missing in the API response.');
        return null;
    }

    // Returnerar väderdata
    return {
        weather: [{
            date: current.time,
            temperature: {
                min: current.temperature,
                max: current.temperature,
                unit: '°C'
            },
            precipitation: {
                sum: current.precipitation || 0,
                unit: 'mm',
                probability: current.precipitation_probability || 0
            },
            wind: {
                speed: current.windspeed,
                gusts: current.windgusts || 0,
                unit: 'km/h',
                direction: {
                    value: current.winddirection,
                    unit: '°'
                }
            },
            weatherCode: current.weathercode
        }],
        position: {
            lat: raw.latitude,
            long: raw.longitude,
        },
    };
}
