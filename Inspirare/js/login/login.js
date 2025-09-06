const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", () => {
  const isPassword = senhaInput.type === "password";
  senhaInput.type = isPassword ? "text" : "password";
  toggleSenha.src = isPassword ? "../img/eye_opened.svg" : "../img/eye_closed.svg";
});
