// js/main.js
import { getQuitoWeather, getRandomCoffeeJoke, getUSDtoEURRate } from './apis.js';
import { COFFEE_PRODUCTS, renderCatalog } from './catalog.js';

// Variables de estado de la aplicación
let cart = [];
let eurRate = 0.92;

// Esperar a que el HTML cargue por completo
document.addEventListener("DOMContentLoaded", async () => {
    const catalogContainer = document.getElementById("catalog-container");

    // 1. Cargar las APIs dinámicas (Con estados de carga)
    await initHeroAPIs();

    // 2. Renderizar el catálogo por primera vez
    renderCatalog(COFFEE_PRODUCTS, catalogContainer, addToCart);

    // 3. Activar Filtros de Búsqueda
    setupFilters(catalogContainer);

    // 4. Activar Calculadora y Formulario
    setupCalculatorEvents();
    setupFormValidation();
});

// Inicialización de APIs con indicadores de carga
async function initHeroAPIs() {
    const tempSpan = document.getElementById("temp-value");
    const quoteText = document.getElementById("daily-quote");

    // Mostrar estados de carga iniciales
    tempSpan.textContent = "Cargando...";
    quoteText.textContent = "Buscando inspiración cafetera...";

    // Llamadas asíncronas
    const temp = await getQuitoWeather();
    tempSpan.textContent = temp !== null ? `${temp}` : "No disponible";

    const joke = await getRandomCoffeeJoke();
    quoteText.textContent = joke;

    // Guardar tasa de cambio en segundo plano
    eurRate = await getUSDtoEURRate();
}

// Filtros de búsqueda (Nombre y Origen)
function setupFilters(container) {
    const searchInput = document.getElementById("search-input");
    const originFilter = document.getElementById("origin-filter");

    const filterProducts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedOrigin = originFilter.value;

        const filtered = COFFEE_PRODUCTS.filter(coffee => {
            const matchesSearch = coffee.name.toLowerCase().includes(searchTerm);
            const matchesOrigin = selectedOrigin === "all" || coffee.origin === selectedOrigin;
            return matchesSearch && matchesOrigin;
        });

        renderCatalog(filtered, container, addToCart);
    };

    searchInput.addEventListener("input", filterProducts);
    originFilter.addEventListener("change", filterProducts);
}

// Lógica del Carrito / Pedido
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsDiv = document.getElementById("cart-items");
    const subtotalSpan = document.getElementById("subtotal");
    const shippingSpan = document.getElementById("shipping");
    const totalSpan = document.getElementById("total");

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Tu carrito está vacío.</p>";
        subtotalSpan.textContent = "0.00";
        shippingSpan.textContent = "0.00";
        totalSpan.textContent = "0.00";
        document.getElementById("total-eur").style.display = "none";
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>☕ ${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    subtotalSpan.textContent = subtotal.toFixed(2);

    const deliveryZoneSelect = document.getElementById("delivery-zone");
    const shippingCost = parseFloat(deliveryZoneSelect.value) || 0;
    shippingSpan.textContent = shippingCost.toFixed(2);

    const total = subtotal + shippingCost;
    totalSpan.textContent = total.toFixed(2);
    
    // Ocultar euros si cambia algo para evitar datos desactualizados
    document.getElementById("total-eur").style.display = "none";
}

function setupCalculatorEvents() {
    document.getElementById("delivery-zone").addEventListener("change", updateCartUI);

    const convertBtn = document.getElementById("convert-eur");
    const eurContainer = document.getElementById("total-eur");

    convertBtn.addEventListener("click", () => {
        const totalUsd = parseFloat(document.getElementById("total").textContent);
        if (totalUsd === 0) {
            alert("Agrega productos al carrito primero.");
            return;
        }
        const totalEur = totalUsd * eurRate;
        eurContainer.querySelector("span").textContent = totalEur.toFixed(2);
        eurContainer.style.display = "block";
    });
}

// Validación Avanzada de Formulario en Tiempo Real
function setupFormValidation() {
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");

    // Estilos rápidos para errores
    nameError.style.color = "red";
    emailError.style.color = "red";

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        // Validar Nombre
        if (nameInput.value.trim() === "") {
            nameError.textContent = "El nombre es obligatorio.";
            isValid = false;
        } else {
            nameError.textContent = "";
        }

        // Validar Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = "Ingresa un correo electrónico válido.";
            isValid = false;
        } else {
            emailError.textContent = "";
        }

        if (isValid) {
            alert(`¡Gracias, ${nameInput.value}! Tu mensaje ha sido enviado con éxito.`);
            form.reset();
            cart = []; // Vaciar carrito como simulación de orden enviada
            updateCartUI();
        }
    });
}