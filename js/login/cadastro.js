const checkboxes = document.querySelectorAll('input[name="type"]');
const formKidTeen = document.getElementById('form-kid-teen');
const formAdult = document.getElementById('form-adult');
const registerBtn = document.getElementById('register-btn');
const successModal = document.getElementById('success-register-modal');

// Função que mostra/oculta input "Outro"
function setupGenero(formElement) {
    const generoSelect = formElement.querySelector('select[id^="genero"]');
    let inputOutroGenero = null;

    generoSelect.addEventListener('change', () => {
        const valor = generoSelect.value;

        if (valor === "Outro") {
            if (!inputOutroGenero) {
                inputOutroGenero = document.createElement('input');
                inputOutroGenero.type = 'text';
                inputOutroGenero.placeholder = 'Digite seu gênero';
                inputOutroGenero.required = true;
                inputOutroGenero.style.marginTop = '5px';
                generoSelect.parentNode.insertBefore(inputOutroGenero, generoSelect.nextSibling);
            }
        } else {
            if (inputOutroGenero) {
                inputOutroGenero.remove();
                inputOutroGenero = null;
            }
        }
    });

    return function getGeneroValue() {
        if (generoSelect.value === "Outro" && inputOutroGenero) {
            return inputOutroGenero.value.trim();
        }
        return generoSelect.value;
    };
}

const getGeneroKidTeen = setupGenero(document.getElementById('form-kid-teen'));
const getGeneroAdult = setupGenero(document.getElementById('form-adult'));

function getGeneroValue() {
    if (generoSelect.value === "Outro" && inputOutroGenero) {
        return inputOutroGenero.value.trim(); // retorna o valor digitado
    }
    return generoSelect.value; // retorna o valor selecionado normalmente
}

function showModal(message) {
    let existing = document.getElementById('error-modal');
    if (!existing) {
        // Cria o modal se não existir
        const modal = document.createElement('div');
        modal.id = 'error-modal';
        modal.className = 'modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';

        const content = document.createElement('div');
        content.style.background = '#fff';
        content.style.padding = '2rem';
        content.style.borderRadius = '8px';
        content.style.textAlign = 'center';
        content.style.maxWidth = '400px';
        content.style.width = '80%';
        content.id = 'error-modal-content';

        const p = document.createElement('p');
        p.id = 'error-modal-text';
        content.appendChild(p);

        const btn = document.createElement('button');
        btn.textContent = 'OK';
        btn.style.marginTop = '1rem';
        btn.style.padding = '0.5rem 1rem';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.background = '#BB8991';
        btn.style.color = '#fff';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        content.appendChild(btn);
        modal.appendChild(content);
        document.body.appendChild(modal);
        existing = modal;
    }

    // Atualiza o texto e mostra
    document.getElementById('error-modal-text').textContent = message;
    existing.style.display = 'flex';
}

function initProfilePic(formElement) {
    const picDiv = formElement.querySelector('.profile-pic');
    const picText = formElement.querySelector('.profile-pic-text');
    const fileInp = formElement.querySelector('.profile-pic-input');
    const nameInp = formElement.querySelector('input[type="text"][placeholder="Digite seu nome completo"]');
    if (!picDiv || !picText || !fileInp) return;

    const updateInitials = () => {
        if (fileInp.files.length) return;
        const full = (nameInp?.value || '').trim().replace(/\s+/g, ' ');
        if (!full) { picText.textContent = '+'; return; }
        const ignore = ['da', 'de', 'do', 'das', 'dos', 'e'];
        const parts = full.split(' ').filter(p => p && !ignore.includes(p.toLowerCase()));
        const first = parts[0]?.[0] || full[0];
        const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
        picText.textContent = (first + last).toUpperCase();
    };

    fileInp.addEventListener('click', e => e.stopPropagation());
    fileInp.addEventListener('change', () => {
        const f = fileInp.files[0];
        if (!f) { picDiv.style.backgroundImage = 'none'; updateInitials(); return; }
        const reader = new FileReader();
        reader.onload = e => {
            picDiv.style.backgroundImage = `url('${e.target.result}')`;
            picDiv.style.backgroundSize = 'cover';
            picDiv.style.backgroundRepeat = 'no-repeat';
            picDiv.style.backgroundPosition = 'center';
            picText.textContent = '';
        };
        reader.readAsDataURL(f);
    });
    nameInp?.addEventListener('input', updateInitials);
    updateInitials();
}

initProfilePic(document.getElementById('form-kid-teen'));
initProfilePic(document.getElementById('form-adult'));

function setupPhoneInput(inputId, defaultCountryCode = "+55") {
    const input = document.getElementById(inputId);

    const countries = [
        { name: "Brasil", code: "+55", mask: "(##) #####-####" },
        { name: "Estados Unidos", code: "+1", mask: "(###) ###-####" },
        { name: "Reino Unido", code: "+44", mask: "#### ### ####" },
        { name: "Itália", code: "+39", mask: "#### ### ####" },
        { name: "Não achou seu país? clique aqui." }
    ];

    let currentCountry = countries.find(c => c.code === defaultCountryCode) || countries[0];
    let currentNumber = "";

    // Inicializa
    input.value = currentCountry.code + " ▼ ";

    // --- Funções ---
    function applyMask(value, mask) {
        let i = 0;
        return mask.replace(/#/g, _ => value[i++] || '');
    }

    function toggleCountryModal() {
        const existingModal = document.getElementById("countryModal-" + inputId);
        if (existingModal) {
            existingModal.remove();
            input.value = currentCountry.code + " ▼ " + applyMask(currentNumber, currentCountry.mask);
            return;
        }

        input.value = currentCountry.code + " ▲ " + applyMask(currentNumber, currentCountry.mask);

        const modal = document.createElement("div");
        modal.id = "countryModal-" + inputId;
        modal.style.position = "absolute";
        modal.style.background = "#fff";
        modal.style.border = "1px solid #ccc";
        modal.style.padding = "5px";
        modal.style.top = input.getBoundingClientRect().bottom + window.scrollY + "px";
        modal.style.left = input.getBoundingClientRect().left + window.scrollX + "px";
        modal.style.zIndex = 1000;

        countries.forEach(c => {
            const item = document.createElement("div");

            if (c.code) {
                item.textContent = c.name + " (" + c.code + ")";
                item.addEventListener("click", () => {
                    if (c.code !== currentCountry.code) {
                        // <<< mudou o país → apaga número digitado
                        currentCountry = c;
                        currentNumber = "";
                        input.value = currentCountry.code + " ▼ ";
                    } else {
                        // <<< clicou no mesmo país → mantém o número
                        input.value = currentCountry.code + " ▼ " + applyMask(currentNumber, currentCountry.mask);
                    }
                    input.focus();
                    modal.remove();
                });
            } else {
                item.textContent = c.name;
                item.style.fontStyle = "italic";
                item.style.color = "#3A503D";
                item.addEventListener("click", () => {
                    modal.remove();
                    const overlay = document.createElement("div");
                    overlay.style.position = "fixed";
                    overlay.style.top = 0;
                    overlay.style.left = 0;
                    overlay.style.width = "100%";
                    overlay.style.height = "100%";
                    overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
                    overlay.style.display = "flex";
                    overlay.style.flexDirection = "column";
                    overlay.style.justifyContent = "center";
                    overlay.style.alignItems = "center";
                    overlay.style.color = "#fff";
                    overlay.style.fontSize = "18px";
                    overlay.style.zIndex = 9999;
                    overlay.innerHTML = `
                        <div class="loader" style="border: 5px solid #f3f3f3; border-top: 5px solid #BB8991; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>
                        <p style="margin-top: 20px; text-align: center;">Você será redirecionado ao nosso contato para realização de cadastro</p>
                    `;
                    document.body.appendChild(overlay);

                    setTimeout(() => {
                        const numeroWhatsApp = "5511942271174";
                        const mensagem = encodeURIComponent("Olá, não encontrei meu país no cadastro.");
                        const link = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
                        window.open(link, "_blank");
                        overlay.remove();
                    }, 2000);
                });
            }

            item.style.padding = "5px";
            item.style.cursor = "pointer";
            item.addEventListener("mouseenter", () => item.style.backgroundColor = "#BB8991");
            item.addEventListener("mouseleave", () => item.style.backgroundColor = "");
            modal.appendChild(item);
        });

        document.body.appendChild(modal);

        function clickOutside(e) {
            if (!modal.contains(e.target) && e.target !== input) {
                modal.remove();
                input.value = currentCountry.code + " ▼ " + applyMask(currentNumber, currentCountry.mask);
                document.removeEventListener("click", clickOutside);
            }
        }
        document.addEventListener("click", clickOutside);
    }

    // --- Eventos ---
    input.addEventListener("keydown", (e) => {
        const prefixLength = currentCountry.code.length + 2;
        if (input.selectionStart <= prefixLength && (e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault();
            return;
        }
        if (e.key === "Backspace") {
            e.preventDefault();
            let pos = input.selectionStart;
            let val = input.value.split('');
            for (let i = pos - 1; i >= prefixLength; i--) {
                if (/\d/.test(val[i])) {
                    val.splice(i, 1);
                    input.value = val.join('');
                    input.setSelectionRange(i, i);
                    break;
                }
            }
        }
        if (e.key === "Delete") {
            e.preventDefault();
            let pos = input.selectionStart;
            let val = input.value.split('');
            for (let i = pos; i < val.length; i++) {
                if (/\d/.test(val[i])) {
                    val.splice(i, 1);
                    input.value = val.join('');
                    input.setSelectionRange(pos, pos);
                    break;
                }
            }
        }
    });

    input.addEventListener("mousemove", (e) => {
        const prefixLength = currentCountry.code.length + 2;
        const inputRect = input.getBoundingClientRect();
        const relativeX = e.clientX - inputRect.left;
        input.style.cursor = (relativeX <= prefixLength * 10) ? "pointer" : "text";
    });

    input.addEventListener("click", (e) => {
        if (input.selectionStart <= currentCountry.code.length + 2) {
            toggleCountryModal();
        }
    });

    input.addEventListener("input", () => {
        let val = input.value.replace(/\D/g, "");
        const prefixNumbers = currentCountry.code.replace("+", "");
        if (val.startsWith(prefixNumbers)) val = val.slice(prefixNumbers.length);

        currentNumber = val;
        const masked = applyMask(val, currentCountry.mask);
        input.value = currentCountry.code + " ▼ " + masked;
    });
}

setupPhoneInput("phone");
setupPhoneInput("phone2");
setupPhoneInput("phone3")

function updateAgeField() {
    const selected = document.querySelector('input[name="type"]:checked');
    const ageContainer = document.getElementById('age-kid-teen-container');
    ageContainer.innerHTML = '';
    if (!selected) return;

    if (selected.value === 'crianca' || selected.value === 'adolescente') {
        const select = document.createElement('select');
        select.id = 'age-kid-teen';
        select.required = true;
        select.innerHTML = '<option value="">Selecione a sua idade</option>';
        const min = selected.value === 'crianca' ? 5 : 12;
        const max = selected.value === 'crianca' ? 11 : 17;
        for (let i = min; i <= max; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
        ageContainer.appendChild(select);
    } else if (selected.value === 'adulto') {
        const ageInput = document.getElementById('age-adult');
        ageInput.value = '';
    }
}

checkboxes.forEach(cb => cb.addEventListener('change', () => {
    checkboxes.forEach(cb2 => { if (cb2 !== cb) cb2.checked = false });
    if (cb.checked) {
        if (cb.value === 'adulto') { formAdult.classList.remove('hidden'); formKidTeen.classList.add('hidden'); }
        else { formKidTeen.classList.remove('hidden'); formAdult.classList.add('hidden'); }
    } else { formKidTeen.classList.add('hidden'); formAdult.classList.add('hidden'); }
    updateAgeField();
    validatePassword();
}));

updateAgeField();

function validatePassword() {
    const activeForm = !formKidTeen.classList.contains('hidden') ? formKidTeen : formAdult;
    const passwordInput = activeForm.querySelector('input[type="password"]');
    if (!passwordInput) return true;
    const password = passwordInput.value;
    const prefix = passwordInput.id.includes('kid') ? 'kid' : 'adult';
    const reqUppercase = document.getElementById(`${prefix}-req-uppercase`);
    const reqSpecial = document.getElementById(`${prefix}-req-special`);
    const reqNumber = document.getElementById(`${prefix}-req-number`);
    const reqLength = document.getElementById(`${prefix}-req-length`);
    reqUppercase.style.color = /[A-Z]/.test(password) ? 'green' : 'red';
    reqSpecial.style.color = /[@#$%&*!]/.test(password) ? 'green' : 'red';
    reqNumber.style.color = /[0-9]/.test(password) ? 'green' : 'red';
    reqLength.style.color = password.length >= 8 ? 'green' : 'red';
    return /[A-Z]/.test(password) && /[@#$%&*!]/.test(password) && /[0-9]/.test(password) && password.length >= 8;
}

document.querySelectorAll('input[type="password"]').forEach(input => input.addEventListener('input', validatePassword));

document.addEventListener("firebaseReady", () => {
    const registerBtn = document.getElementById("register-btn");

    // Função para redimensionar a imagem e gerar Base64
    async function getResizedBase64(file, maxWidth = 300) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(maxWidth / img.width, 1); // não aumenta se menor
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // qualidade 70%
            };

            img.onerror = reject;
        });
    }

    registerBtn.addEventListener('click', async () => {
        const formToValidate = !formKidTeen.classList.contains("hidden") ? formKidTeen : formAdult;
        const requiredInputs = formToValidate.querySelectorAll("input[required], select[required]");
        let allFilled = true;
        requiredInputs.forEach(input => { if (!input.value.trim()) allFilled = false });
        const passwordIsValid = validatePassword();

        if (!allFilled) { showModal("Por favor, preencha todos os campos."); return; }
        if (!passwordIsValid) { showModal("A senha não atende aos requisitos."); return; }

        // Verifica idade do adulto
        if (formAdult && !formAdult.classList.contains("hidden")) {
            const ageAdultInput = document.getElementById('age-adult');
            const age = parseInt(ageAdultInput.value, 10);
            if (isNaN(age)) { showModal("Por favor, digite um número válido para a idade."); return; }
            if (age < 18) { showModal("A idade mínima para adultos é 18 anos."); return; }
            if (age > 120) { showModal("A idade máxima permitida é 120 anos."); return; }
        }

        try {
            // Campos comuns
            const emailInput = formToValidate.querySelector('input[type="email"]');
            const passwordInput = formToValidate.querySelector('input[type="password"]');
            const nomeInput = formToValidate.querySelector('input[type="text"][placeholder="Digite seu nome completo"]');
            let telefoneResponsavel = '';
            let telefoneUsuario = '';
            let genero;

            if (!formKidTeen.classList.contains("hidden")) {
                genero = getGeneroKidTeen();
                telefoneResponsavel = formToValidate.querySelector('#phone')?.value || '';
                telefoneUsuario = formToValidate.querySelector('#phone2')?.value || '';
            } else {
                genero = getGeneroAdult();
                telefoneUsuario = formToValidate.querySelector('#phone3')?.value || '';
            }

            // Idade
            let idade = '';
            if (formAdult && !formAdult.classList.contains("hidden")) {
                idade = document.getElementById('age-adult').value;
            } else if (!formKidTeen.classList.contains("hidden")) {
                const ageSelect = document.getElementById('age-kid-teen');
                if (ageSelect) idade = ageSelect.value;
            }

            let emailResponsavel = '';
            if (!formKidTeen.classList.contains("hidden")) {
                const emailRespInput = formToValidate.querySelector('input[placeholder="Digite o email do responsável"]');
                emailResponsavel = emailRespInput ? emailRespInput.value : '';
            }

            // Define tipo com base na idade
            let tipoUsuario = '';
            const idadeNum = parseInt(idade, 10);
            if (!isNaN(idadeNum)) {
                if (idadeNum >= 5 && idadeNum <= 11) tipoUsuario = "kid";
                else if (idadeNum >= 12 && idadeNum <= 17) tipoUsuario = "teen";
                else if (idadeNum >= 18) tipoUsuario = "adult";
            }

            // Cria usuário no Firebase Auth
            const userCredential = await window.auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value);
            const user = userCredential.user;

            // Converte a foto de perfil para Base64 redimensionada (se houver)
            let photoBase64 = "";
            const fileInput = formToValidate.querySelector('.profile-pic-input');
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                try {
                    photoBase64 = await getResizedBase64(file, 300); // largura máxima 300px
                } catch (err) {
                    console.error("Erro ao redimensionar a imagem:", err);
                    photoBase64 = "";
                }
            }

            // Mostra overlay de loading
            const loadingOverlay = document.getElementById('loading-overlay');
            loadingOverlay.classList.remove('hidden');

            // Espera 3 segundos
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Salva dados no Firestore
            await window.db.collection("usuarios").doc(user.uid).set({
                nome: nomeInput.value,
                email: emailInput.value,
                emailResponsavel,
                genero: genero,
                idade,
                telefoneResponsavel,
                telefoneUsuario,
                tipo: tipoUsuario,
                foto: photoBase64,
                criadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Esconde overlay e mostra modal de sucesso
            loadingOverlay.classList.add('hidden');
            successModal.classList.remove("hidden");
            successModal.style.display = "flex";

        } catch (error) {
            // Esconde overlay se der erro
            const loadingOverlay = document.getElementById('loading-overlay');
            loadingOverlay.classList.add('hidden');

            let mensagem = "Erro ao cadastrar.";

            switch (error.code) {
                case "auth/email-already-in-use":
                    mensagem = "O e-mail informado já está cadastrado. Por favor, utilize outro.";
                    break;
                case "auth/invalid-email":
                    mensagem = "O formato do e-mail é inválido.";
                    break;
                default:
                    mensagem = "Erro ao cadastrar: " + error.message;
            }

            showModal(mensagem);
        }
    });
});

document.getElementById('success-register-ok').addEventListener('click', () => {
    successModal.classList.add("hidden");
    document.querySelector('form.register-form').reset();
    formKidTeen.classList.add("hidden");
    formAdult.classList.add("hidden");
    ['kid', 'adult'].forEach(prefix => {
        document.getElementById(`${prefix}-req-uppercase`).style.color = 'red';
        document.getElementById(`${prefix}-req-special`).style.color = 'red';
        document.getElementById(`${prefix}-req-number`).style.color = 'red';
        document.getElementById(`${prefix}-req-length`).style.color = 'red';
    });
    document.querySelectorAll('.profile-pic').forEach(p => p.style.backgroundImage = 'none');
    document.querySelectorAll('.profile-pic-text').forEach(s => s.textContent = '+');
    document.querySelectorAll('.profile-pic-input').forEach(i => i.value = '');
    window.location.href = 'login.html';
});

document.querySelector('form.register-form').addEventListener('submit', (e) => {
    e.preventDefault(); // impede validação nativa
    registerBtn.click(); // dispara seu código de validação customizado
});

document.querySelectorAll(".toggle-eye").forEach(icon => {
    icon.addEventListener("click", () => {
        const inputId = icon.getAttribute("data-target");
        const input = document.getElementById(inputId);

        if (input.type === "password") {
            input.type = "text";
            icon.src = "../img/eye_opened.svg"; // ícone de olho fechado
        } else {
            input.type = "password";
            icon.src = "../img/eye_closed.svg"; // ícone de olho aberto
        }
    });
});
