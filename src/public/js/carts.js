let URLactual = window.location;
let URL = URLactual.toString();
let URLsplit = URL.split("/");
let cartId = URLsplit[URLsplit.length - 1];
console.log(cartId)
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

async function minus(pid) {
    const URL = `/api/cart/${cartId}/product/${pid}`;
    console.log(URL);

    const response = await fetch(URL, {
        method: "DELETE",
    });
    const data = await response.json();
    cartCount--;
    localStorage.setItem("cartCount", cartCount);

    window.location.reload();
};

async function plus(pid) {
    const URL = `/api/cart/${cartId}/product/${pid}`;
    console.log(URL);

    const response = await fetch(URL, {
        method: "PUT",
    });
    const data = await response.json();
    cartCount++;
    localStorage.setItem("cartCount", cartCount);

    window.location.reload();
}

// Login Modal
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const modal = document.getElementsByClassName("modal");
const checkOutBtn = document.getElementsByClassName("checkoutButton")[0];
const singupLink = document.getElementById("signupLink");
const loginClose = document.getElementById("login-close");
const signupClose = document.getElementById("signup-close");

checkOutBtn.onclick = function () {
    modal[0].style.display = "block";
};

loginClose.onclick = function () {
    loginModal.style.display = "none";
};

signupClose.onclick = function () {
    signupModal.style.display = "none";
}

singupLink.onclick = function () {
    modal[1].style.display = "block";
    modal[0].style.display = "none";
};








