let cartCount = 0;

document.addEventListener("DOMContentLoaded", async () => {
    let cartId = localStorage.getItem("cartId");
    console.log("se ejecuta correctamente DOMContentLoaded")
    let URL = "/api/cart"
    console.log(URL)
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(error => {
        console.error("Error en la solicitud fetch:", error);
    });

    const data = await response.json();
    console.log("Respuesta del servidor al intentar crear el carrito:", data);
    console.log(`El ID de data es ${data.id}`)
    if (!data || !data.id) {
        console.error("Error al intentar obtener el ID del carrito del servidor.");
        return;
    }

    cartId = data.id;
    localStorage.setItem("cartId", cartId);
    console.log(`ID del carrito creado: ${cartId}`);

    updateCartCount();
});

async function addToCart(productId) {
    try {
        let cartId = localStorage.getItem("cartId");

        if (!cartId) {
            const response = await fetch("api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status !== "ok") {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data._id) {
                cartId = data._id;
                localStorage.setItem("cartId", cartId);
                console.log(`Carrito creado con ID: ${cartId}`);
            } else {
                throw new Error("El ID del carrito no se recibió correctamente del servidor.");
            }
        }

        let URL = `/api/cart/${cartId}/product/${productId}`;
        console.log(URL);

        const response = await fetch(URL, {
            method: "PUT",
        });

        const data = await response.json();
        console.log(data);

        //window.location.reload();

        cartCount ++;
        updateCartCount();
    } catch (error) {
        console.error("Hubo un problema al agregar el producto al carrito:", error);
    }
};

function updateCartCount() {
    document.querySelector('.cartCount').textContent = cartCount;
}