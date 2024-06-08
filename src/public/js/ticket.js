const buttonPay = document.getElementById("button-pay");
const buttonReturn = document.getElementById("return-button");

buttonPay.addEventListener("click", () => {
    Toastify({
        text: "Pago realizado con exito",
        className: "info",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
});

buttonReturn.addEventListener("click", () => {
    history.back();
});
