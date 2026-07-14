// js/apis.js

// Coordenadas geográficas de Quito
const QUITO_LAT = -0.2186;
const QUITO_LON = -78.5097;

// 1. API de Clima (Open-Meteo)
export async function getQuitoWeather() {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${QUITO_LAT}&longitude=${QUITO_LON}&current_weather=true`);
        if (!response.ok) throw new Error("No se pudo conectar con el servicio meteorológico.");
        const data = await response.json();
        return data.current_weather.temperature;
    } catch (error) {
        console.error("Error en Clima:", error.message);
        return null; // Retorna null para que main.js muestre un mensaje amigable
    }
}

// 2. API de Frases (Random Jokes como alternativa de café)
export async function getRandomCoffeeJoke() {
    try {
        const response = await fetch("https://official-joke-api.appspot.com/jokes/coffee/random");
        if (!response.ok) throw new Error("No se pudo conectar con el servicio de frases.");
        const data = await response.json();
        const joke = Array.isArray(data) ? data[0] : data;
        return `"${joke.setup} — ${joke.punchline}"`;
    } catch (error) {
        console.error("Error en Frase:", error.message);
        return "«El buen café une a las personas y despierta los sentidos.»"; // Frase de respaldo
    }
}

// 3. API de Monedas (Exchange Rate-API)
export async function getUSDtoEURRate() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!response.ok) throw new Error("No se pudo conectar con el servicio de divisas.");
        const data = await response.json();
        return data.rates.EUR;
    } catch (error) {
        console.error("Error en Conversión:", error.message);
        return 0.92; // Tasa de respaldo aproximada
    }
}