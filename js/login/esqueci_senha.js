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
        showModal("Código incorreto. Tente novamente.");
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

// === MODAL CUSTOMIZADO ===
function showModal(message) {
    const modal = document.getElementById("customModal");
    const messageEl = document.getElementById("customModalMessage");
    messageEl.textContent = message;
    modal.style.display = "flex";
}

function traduzErro(errMessage) {
    if (!errMessage) return "Ocorreu um erro desconhecido.";

    const erros = {
        "Failed to fetch": "Não foi possível conectar ao servidor. Verifique sua internet ou se o servidor está ativo.",
        "NetworkError": "Erro de rede. Tente novamente mais tarde.",
        "timeout": "A requisição demorou muito para responder (timeout).",
        "Unexpected token": "Resposta inválida do servidor.",
        "Internal Server Error": "Erro interno no servidor.",
        "Bad Request": "Requisição inválida. Verifique os dados enviados.",
        "Unauthorized": "Acesso não autorizado.",
        "Forbidden": "Permissão negada.",
        "Not Found": "Servidor ou recurso não encontrado.",
        "Service Unavailable": "Servidor indisponível no momento.",
        "unable to verify the first certificate": "Não foi possível verificar o certificado SSL do servidor."
    };

    // Procura se alguma chave aparece dentro da mensagem do erro
    for (let chave in erros) {
        if (errMessage.includes(chave)) {
            return erros[chave];
        }
    }

    // Se não encontrou nenhuma tradução específica
    return "Erro: " + errMessage;
}

// Fechar modal
document.getElementById("customModalClose").addEventListener("click", () => {
    document.getElementById("customModal").style.display = "none";
});

// === ENVIO DO EMAIL COM CÓDIGO ===
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('user-or-email').value.trim();
    if (!email) {
        showModal("Digite um email válido.");
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
            showModal("Código enviado! Confira seu email.");
            forgotPasswordForm.style.display = "none";
            verificationCodeForm.style.display = "block";
            codeInputs[0].focus();
        } else {
            // Novo tratamento para usuário não encontrado
            if (data.error && (data.error.includes("not found") || data.error.includes("Usuário não encontrado"))) {
                showModal("Usuário não encontrado.");
            } else {
                showModal("Erro ao enviar email: " + traduzErro(data.error));
            }
        }
    } catch (err) {
        showModal(traduzErro(err.message));
    }
});

// === VOLTAR AO LOGIN ===
forgotBackLogin.addEventListener('click', (e) => {
    window.location.href = '../login/login.html';
});
