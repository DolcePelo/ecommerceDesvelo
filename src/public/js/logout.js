const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
    console.log("Logout button clicked")
    window.location.href = "/login";
});