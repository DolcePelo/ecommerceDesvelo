let URLactual = window.location;
let URL = URLactual.toString();
let URLsplit =  URL.split("/");
let cartId = URLsplit[URLsplit.length - 1];
console.log(cartId)

// function updateTotal() {
//     let total = 0;

//     document.querySelectorAll('.cartContentBodyItem').forEach(item => {
//         const subtotal = parseFloat(item.querySelector('.cartContentBodyItemSubtotal p').textContent.substring(2));
//         total += subtotal;
//     });
//     document.getElementById('cartTotalAmount').textContent = total.toFixed(2);
//     window.location.reload();

// }

async function minus(pid) {
    const URL = `/api/cart/${cartId}/product/${pid}`;
    console.log(URL);

    const response = await fetch(URL, {
        method: "DELETE",
    });
    const data = await response.json();
    // if(data.status === "ok") {
    //     updateTotal();
    // };
    window.location.reload();
};

async function plus(pid) {
    const URL = `/api/cart/${cartId}/product/${pid}`;
    console.log(URL);
    
    const response = await fetch(URL, {
        method: "PUT",
    });
    const data = await response.json();

    // if(data.status === "ok") {
    //     updateTotal();
    // };
    window.location.reload();

}