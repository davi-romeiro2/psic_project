const forgotPasswordForm = document.getElementById('forgot-password-form');
const verificationCodeForm = document.getElementById('verification-code-form');
const codeInputs = verificationCodeForm.querySelectorAll('.code-inputs input');
const newPasswordForm = document.getElementById('new-password-form');
const passwordInput = document.getElementById('new-password-input');
const updatePasswordButton = document.getElementById('update-password-btn');
const successModal = document.getElementById('success-modal');
const successOk = document.getElementById('success-ok');
const reqUppercase = document.getElementById('req-uppercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');
const reqLength = document.getElementById('req-length');
const forgotBackLogin = document.getElementById('forgot-back-login');

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
        showModal("Digite uma nova senha.");
        return;
    }
    const isValid = validatePassword();
    if (isValid) {
        successModal.style.display = 'flex';
    } else {
        showModal("A senha não atende aos requisitos.");
        successModal.style.display = 'none';
    }
});

if (successOk) {
    successOk.addEventListener('click', () => {
        window.location.href = './login.html';
    });
}

// === CONFIGURAÇÃO DOS INPUTS DE CÓDIGO ===
codeInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        const allFilled = Array.from(codeInputs).every(inp => inp.value.length === 1);
        if (allFilled) {
            verificationCodeForm.style.display = "none";
            newPasswordForm.style.display = "block";
            newPasswordForm.querySelector('input').focus();
        }
        if (input.value.length > 0 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            codeInputs[index - 1].focus();
        }
    });
});

// === MODAL CUSTOMIZADO ===
function showModal(message) {
    const modal = document.getElementById("customModal");
    const messageEl = document.getElementById("customModalMessage");
    messageEl.textContent = message;
    modal.style.display = "flex";
}

// Fechar modal
document.getElementById("customModalClose").addEventListener("click", () => {
    document.getElementById("customModal").style.display = "none";
});

// === SIMULA ENVIO DE EMAIL (SEM BACKEND) ===
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('user-or-email').value.trim();
    if (!email) {
        showModal("Digite um email válido.");
        return;
    }

    // Em vez de chamar backend, já abre direto o form de código
    showModal("Código gerado! Digite-o abaixo.");
    forgotPasswordForm.style.display = "none";
    verificationCodeForm.style.display = "block";
    codeInputs[0].focus();
});

// === VOLTAR AO LOGIN ===
forgotBackLogin.addEventListener('click', () => {
    window.location.href = '../login/login.html';
});
