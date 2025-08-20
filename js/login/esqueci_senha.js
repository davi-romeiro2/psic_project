const forgotPasswordModal = document.getElementById('forgot-password-modal');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const verificationCodeForm = document.getElementById('verification-code-form');
const codeInputs = verificationCodeForm.querySelectorAll('.code-inputs input');
const newPasswordForm = document.getElementById('new-password-form');
const loadingSpinner = document.getElementById('loading-spinner');
const passwordInput = document.getElementById('new-password-input');
const updatePasswordButton = document.getElementById('update-password-btn');
const successModal = document.getElementById('success-modal');
const successOk = document.getElementById('success-ok');
const modalOverlay = document.getElementById('modal-overlay');
const loginModal = document.getElementById('login-modal');
const reqUppercase = document.getElementById('req-uppercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');
const reqLength = document.getElementById('req-length');
const forgotBackLogin = document.getElementById('forgot-back-login');

// === VARIÁVEL GLOBAL PARA O CÓDIGO ===
let codigoGerado = "";

// === FUNÇÃO PARA GERAR CÓDIGO ALEATÓRIO DE 6 DÍGITOS ===
function gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// === FUNÇÃO PARA VALIDAR SENHA ===
function validatePassword() {
    const password = passwordInput.value;
    let isValid = true;

    reqUppercase.style.color = /[A-Z]/.test(password) ? 'green' : 'red';
    reqNumber.style.color = /[0-9]/.test(password) ? 'green' : 'red';
    reqSpecial.style.color = /[@#$%&*]/.test(password) ? 'green' : 'red';
    reqLength.style.color = password.length >= 8 ? 'green' : 'red';

    if (!(/[A-Z]/.test(password) && /[0-9]/.test(password) && /[@#$%&*]/.test(password) && password.length >= 8)) {
        isValid = false;
    }

    return isValid;
}

passwordInput.addEventListener('input', validatePassword);

updatePasswordButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (passwordInput.value.trim() === '') {
        alert("Digite uma nova senha.");
        return;
    }
    const isValid = validatePassword();
    if (isValid) {
        successModal.style.display = 'flex';
    } else {
        alert("A senha não atende aos requisitos.");
        successModal.style.display = 'none';
    }
});

if (successOk) {
    successOk.addEventListener('click', () => {
        window.location.href = './login.html';
    });
}

// === FUNÇÃO PARA CHECAR SE TODOS INPUTS DE CÓDIGO ESTÃO PREENCHIDOS ===
function checkCodeComplete() {
    const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
    if (allFilled) verificarCodigo();
}

// === FUNÇÃO PARA VERIFICAR CÓDIGO ===
function verificarCodigo() {
    const codigoDigitado = Array.from(codeInputs).map(input => input.value).join('');
    if (codigoDigitado === codigoGerado) {
        verificationCodeForm.style.display = "none";
        newPasswordForm.style.display = "block";
        newPasswordForm.querySelector('input').focus();
    } else {
        alert("Código incorreto. Tente novamente.");
        codeInputs.forEach(input => input.value = "");
        codeInputs[0].focus();
    }
}

// === CONFIGURAÇÃO DOS INPUTS DE CÓDIGO ===
codeInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        checkCodeComplete();
        if (input.value.length > 0 && index < codeInputs.length - 1) codeInputs[index + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) codeInputs[index - 1].focus();
    });
});

// === ENVIO DO EMAIL COM CÓDIGO ===
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('user-or-email').value.trim();
    if (!email) { 
        alert("Digite um email válido."); 
        return; 
    }

    // Gera o código e salva globalmente
    codigoGerado = gerarCodigo();

    // Chama o backend para enviar email
    try {
        const response = await fetch("http://localhost:3000/enviar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, codigo: codigoGerado }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Código enviado! Confira seu email.");
            forgotPasswordForm.style.display = "none";
            verificationCodeForm.style.display = "block";
            codeInputs[0].focus();
        } else {
            alert("Erro ao enviar email: " + data.error);
        }
    } catch (err) {
        alert("Erro na requisição: " + err.message);
    }
});

// === VOLTAR AO LOGIN ===
forgotBackLogin.addEventListener('click', (e) => {
    window.location.href = '../login/login.html'; 
});
