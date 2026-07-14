// js/catalog.js

// Catálogo con enlaces de imágenes reales de café
export const COFFEE_PRODUCTS = [
    { 
        id: 1, 
        name: "Intag Selection", 
        origin: "Ecuador", 
        notes: "Chocolate amargo, cítricos", 
        price: 12.50,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80" // Café filtrado elegante
    },
    { 
        id: 2, 
        name: "Huila Premium", 
        origin: "Colombia", 
        notes: "Frutos rojos, caramelo", 
        price: 14.00,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" // Taza de espresso/capuchino
    },
    { 
        id: 3, 
        name: "Cerrado Dulce", 
        origin: "Brasil", 
        notes: "Nueces, cuerpo cremoso", 
        price: 11.50,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80" // Granos de café y taza
    },
    { 
        id: 4, 
        name: "Yirgacheffe", 
        origin: "Etiopía", 
        notes: "Jazmín, notas florales", 
        price: 16.50,
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80" // Cafetera de prensa o taza clásica
    },
    { 
        id: 5, 
        name: "Lojano Exclusivo", 
        origin: "Ecuador", 
        notes: "Miel, caña de azúcar", 
        price: 15.00,
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80" // Latte art moderno
    }
];

// Función para renderizar dinámicamente incluyendo la imagen
export function renderCatalog(products, container, onAddCallback) {
    container.innerHTML = ""; 

    if (products.length === 0) {
        container.innerHTML = `<p class="no-results" style="grid-column: 1/-1; text-align:center;">No se encontraron cafés que coincidan con tu búsqueda.</p>`;
        return;
    }

    products.forEach(product => {
        const article = document.createElement("article");
        article.className = "coffee-card";
        article.innerHTML = `
            <div class="card-img-container">
                <img src="${product.image}" alt="Bolsa o taza de café ${product.name}" class="coffee-img">
            </div>
            <h3>${product.name}</h3>
            <p class="origin"><strong>Origen:</strong> ${product.origin}</p>
            <p class="notes"><em>${product.notes}</em></p>
            <p class="price"><strong>$${product.price.toFixed(2)} USD</strong></p>
            <button class="add-btn" data-id="${product.id}">Agregar al pedido</button>
        `;
        
        article.querySelector(".add-btn").addEventListener("click", () => {
            onAddCallback(product);
        });

        container.appendChild(article);
    });
}