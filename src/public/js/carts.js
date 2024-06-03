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
const singupLink = document.getElementsByClassName("signup-link")[0];
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

//signup para crear role: user
async function postSignupUser(first_name, last_name, email, password, role) {
    const data = {
        first_name,
        last_name,
        email,
        password,
        role,
    };

    const response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
}

const signupForm = document.getElementById("signup-form-user");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email-user").value;
    const password = document.getElementById("password-user").value;
    const role = document.getElementById("role").value;

    const result = await postSignupUser(first_name, last_name, email, password, role);
    if (result.response === "success") {
        modal[1].style.display = "none";
        modal[0].style.display = "block";
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Usuario registrado con exito",
            showConfirmButton: false,
            timer: 4000
        });
    } else {
        alert("Datos incorrectos");
    }
})

//Función para generar ticker y luego del login poder redirigir a la finalización de la compra
async function postTicket(cart, user) {
    let ticketId = "";
    const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({cart, user})
        });
        const result = await response.json();
        console.log(`postTicket result ${result.result._id}`);
        ticketId = result.result._id;
        window.location.href = `/ticket/${ticketId}`
        return result;
}

//login de user: para finalizar compra 
async function postLogin(email, password) {
    let userId = localStorage.getItem("userId");
    console.log("Initial userId from localStorage:", userId);
    
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("Response from server:", data); 

        if(data.respuesta === "ok") {
            userId = data.result._id;
            localStorage.setItem("userId", userId);
            console.log("New userId set in localStorage:", userId);
            postTicket(cartId, userId);
        } else {
            alert("Datos incorrectos");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    postLogin(email, password);
});







