// login.js
document.addEventListener("firebaseReady", () => {
    const loginForm = document.getElementById("loginForm");
    const mensagem = document.getElementById("mensagem");

    // Função para mapear mensagens de erro do Firebase
    function mensagemAmigavelAuth(code) {
        switch (code) {
            case 'auth/invalid-login-credentials':
            case 'auth/wrong-password':
                return 'Email ou senha incorretos.';
            case 'auth/user-not-found':
                return 'Não encontramos uma conta com este email.';
            case 'auth/invalid-email':
                return 'Email inválido. Verifique o formato.';
            case 'auth/too-many-requests':
                return 'Muitas tentativas. Tente novamente em alguns minutos.';
            case 'auth/network-request-failed':
                return 'Falha de rede. Verifique sua conexão.';
            case 'auth/invalid-credential':
                return 'Credenciais inválidas. Tente novamente.';
            default:
                return 'Não foi possível entrar. Tente novamente.';
        }
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        mensagem.textContent = "Verificando...";
        mensagem.style.color = "blue";

        try {
            // Login no Firebase Auth
            const userCredential = await auth.signInWithEmailAndPassword(email, senha);
            const user = userCredential.user;

            // Busca o documento na coleção "usuarios" usando o uid
            const userDoc = await db.collection("usuarios").doc(user.uid).get();

            if (userDoc.exists) {
                mensagem.textContent = "Login realizado com sucesso!";
                mensagem.style.color = "green";

                // Redireciona para a home
                setTimeout(() => {
                    window.location.href = "../home/home.html";
                }, 800);
            } else {
                mensagem.textContent = "Usuário autenticado, mas não encontrado.";
                mensagem.style.color = "orange";
                await auth.signOut();
            }
        } catch (error) {
            // Mensagem customizada conforme o erro
            mensagem.textContent = mensagemAmigavelAuth(error?.code);
            mensagem.style.color = "red";
            console.error("Erro no login:", error);
        }
    });
});

const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", () => {
  const isPassword = senhaInput.type === "password";
  senhaInput.type = isPassword ? "text" : "password";
  toggleSenha.src = isPassword ? "../img/eye_opened.svg" : "../img/eye_closed.svg";
});
