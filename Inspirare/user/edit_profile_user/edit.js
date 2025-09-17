fetch('../side_bar/side_bar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });

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

setupPhoneInput("telefone")
setupPhoneInput("telefoneResp")