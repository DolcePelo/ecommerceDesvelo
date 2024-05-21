let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
let cartLink = document.querySelector(".cartIconContainer a");

document.addEventListener("DOMContentLoaded", async () => {
    let cartId = localStorage.getItem("cartId");
    console.log("se ejecuta correctamente DOMContentLoaded");

    if (!cartId) {
        let URL = "/api/cart";
        console.log(URL);
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).catch(error => {
            console.error("Error en la solicitud fetch:", error);
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta del servidor al intentar crear el carrito:", data);
            if (!data || !data.id) {
                console.error("Error al intentar obtener el ID del carrito del servidor.");
                return;
            }
            cartId = data.id;
            localStorage.setItem("cartId", cartId);
            console.log(`ID del carrito creado: ${cartId}`);
        } else {
            console.error("Error en la respuesta del servidor:", response.statusText);
            return;
        }

    }
    cartLink.href = "/cart/" + cartId;
    updateCartCount();
});

async function addToCart(productId) {
    try {
        let cartId = localStorage.getItem("cartId");

        if (!cartId) {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta del servidor:", data);
                if (data.id) {
                    cartId = data.id;
                    localStorage.setItem("cartId", cartId);
                    console.log(`Carrito creado con ID: ${cartId}`);
                } else {
                    throw new Error("El ID del carrito no se recibió correctamente del servidor.");
                }
            } else {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
        }

        let URL = `/api/cart/${cartId}/product/${productId}`;
        console.log(URL);

        const response = await fetch(URL, {
            method: "PUT",
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            cartCount++;
            localStorage.setItem("cartCount", cartCount);
            updateCartCount();
        } else {
            throw new Error(`Error al agregar el producto: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Hubo un problema al agregar el producto al carrito:", error);
    }
};

function updateCartCount() {
    document.querySelector('.cartCount').textContent = cartCount;
}