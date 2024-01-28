const socket = io();

const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.querySelector(".deleteProduct");
const productList = document.querySelector(".productList");

addProductBtn.addEventListener("click", () => {
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const imageUrl = document.getElementById("imageUrl");
    const code = document.getElementById("code");
    const stock = document.getElementById("stock");
    const category = document.getElementById("category")

    const product = {
        name: name.value,
        description: description.value,
        price: price.value,
        imageUrl: imageUrl.value,
        code: code.value,
        stock: stock.value,
        category: category.value
    };

    socket.emit("addProduct", product);

    const card = document.createElement("div");
    card.classList.add("productCard");
    card.innerHTML = `
            <div class="cardProduct__image">
                <img src=${product.imageUrl} alt=${product.name} />
            </div>
            <div class="cardProduct__info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.category}</p>
                <p>${product.stock}</p>
                <p>${product.code}</p>
            </div>
            <div class="deleteContainer">
                <div class="deleteProduct" id={{this.id}}>X</div>
            </div>
        `;
    productList.appendChild(card);

    name.value = "";
    description.value = "";
    price.value = "";
    imageUrl.value = "";
    code.value = "";
    stock.value = "";
});

const deleteProductBtns = document.querySelectorAll(".deleteButton");

deleteProductBtns.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
        const productId = event.currentTarget.getAttribute("id");
        socket.emit("deleteProduct", productId);
    });
});

socket.on("updateProducts", (data) => {
    if (data.success) {
        productList.innerHTML = "";

        data.allProducts.forEach((product) => {
            const card = document.createElement("div");
            card.classList.add("productCard");
            card.innerHTML = `
            <div class="cardProduct__image">
                <img src=${product.imageUrl} alt=${product.name} />
            </div>
            <div class="cardProduct__info">

                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.category}</p>
                <p>${product.stock}</p>
                <p>${product.code}</p>
            </div>
            <div class="deleteContainer">
                <div class="deleteProduct deleteButton" id={{this.id}}>X</div>
            </div>
            `;
            productList.appendChild(card);
        });
        alert(data.message);
        return;
    } else {
        alert(data.message);
    }
});
