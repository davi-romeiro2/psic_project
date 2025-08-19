// login.js
document.addEventListener("firebaseReady", () => {
    const loginForm = document.getElementById("loginForm");
    const mensagem = document.getElementById("mensagem");

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
                mensagem.textContent = "Usuário autenticado, mas não encontrado no banco.";
                mensagem.style.color = "orange";
                await auth.signOut();
            }
        } catch (error) {
            mensagem.textContent = "Erro: " + error.message;
            mensagem.style.color = "red";
        }
    });
});
