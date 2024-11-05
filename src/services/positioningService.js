export function getPosition() {
    return new Promise((resolve, reject) => {
        // Kontrollera om gps finns i webbläsaren
        if (navigator.geolocation) {
            // Hämtar positionen och lagrar latitud och longitud
            navigator.geolocation.getCurrentPosition(pos => {
                resolve({
                    position: {
                        lat: pos.coords.latitude,
                        long: pos.coords.longitude,
                    },
                })
            })
        } else {
            // Om geolocation inte finns skicka ett felmeddelande
            reject('Geolocation is not supported by this browser.')
        }
    })
}
