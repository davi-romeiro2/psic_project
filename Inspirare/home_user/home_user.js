// 🔹 Carregar sidebar
fetch('../side_bar/side_bar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });

// 🔹 Mostrar card com conteúdo dinâmico
function showCard(type) {
    const card = document.getElementById("info-card");
    const content = document.getElementById("card-content");

    card.classList.remove("hidden");

    if (type === "agendar") {
        content.innerHTML = `
            <h2>Selecione o tipo de pagamento</h2>
            <div class="payment-options-split">
              <div class="payment-side">
                <h3>Consulta avulsa</h3>
                <p>Realize uma única consulta, R$55,00.</p>
                <button class="payment-btn gray" onclick="openPaymentModal('avulsa')">Pagar consulta avulsa</button>
              </div>
              <div class="divider"></div>
              <div class="payment-side">
                <h3>Plano mensal</h3>
                <p>Inclui 4 consultas por mês, R$450,00.</p>
                <button class="payment-btn green" onclick="openPaymentModal('mensal')">Pagar plano mensal</button>
              </div>
            </div>
        `;
    } else if (type === "consultas") {
        content.innerHTML = `
        <h2>Consultas agendadas</h2>
        <div class="scheduled-cards">
            <div class="scheduled-card">
                <p><strong>Horário:</strong> 10:00</p>
                <p><strong>Psicóloga:</strong> Shirley Campos</p>
                <p><strong>Tipo:</strong> Presencial</p>
                <p><strong>Valor:</strong> Avulso</p>
                <p><strong>Data:</strong> 10/09/2025</p>
            </div>
            <div class="scheduled-card">
                <p><strong>Horário:</strong> 14:00</p>
                <p><strong>Psicóloga:</strong> Shirley Campos</p>
                <p><strong>Tipo:</strong> Online</p>
                <p><strong>Valor:</strong> Mensal</p>
                <p><strong>Data:</strong> 10/09/2025</p>
            </div>
            <div class="scheduled-card">
                <p><strong>Horário:</strong> 14:00</p>
                <p><strong>Psicóloga:</strong> Shirley Campos</p>
                <p><strong>Tipo:</strong> Online</p>
                <p><strong>Valor:</strong> Mensal</p>
                <p><strong>Data:</strong> 10/09/2025</p>
            </div>
            <div class="scheduled-card">
                <p><strong>Horário:</strong> 14:00</p>
                <p><strong>Psicóloga:</strong> Shirley Campos</p>
                <p><strong>Tipo:</strong> Online</p>
                <p><strong>Valor:</strong> Mensal</p>
                <p><strong>Data:</strong> 10/09/2025</p>
            </div>
            <div class="scheduled-card">
                <p><strong>Horário:</strong> 14:00</p>
                <p><strong>Psicóloga:</strong> Shirley Campos</p>
                <p><strong>Tipo:</strong> Online</p>
                <p><strong>Valor:</strong> Mensal</p>
                <p><strong>Data:</strong> 10/09/2025</p>
            </div>
            <!-- Você pode adicionar mais cards aqui -->
        </div>
    `;
    }
}

// 🔹 Abrir modal externo
function openPaymentModal(plan) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close"><img src="../img/close_X.svg" alt="Fechar"></button>
      <h2>Escolha a forma de pagamento</h2>
      <div class="pay-methods">
        <button class="pix-btn">Pix</button>
        <button class="card-btn">Cartão de Crédito</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Fechar modal
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());

    // Pix
    modal.querySelector('.pix-btn').addEventListener('click', () => payPix(modal));

    // Cartão
    modal.querySelector('.card-btn').addEventListener('click', () => payCard(modal));
}

// 🔹 Pagamento via Pix
function payPix(modal) {
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
    <button class="modal-close"><img src="../img/close_X.svg" alt="Fechar"></button>
    <h2>Pagamento via Pix</h2>
    <img src="../img/qr_code_example.svg" alt="QR Code" class="qr-code">
    <p><strong>Chave Pix:</strong> <input type="text" value="521-552-078.08" id="pix-key" readonly></p>
    <div class="pix-buttons">
      <button id="copy-pix" class="pix-copy-btn">
        <img src="../img/copy_icon.svg" alt="Copiar" class="btn-icon">
        Copiar chave Pix
      </button>
      <button id="confirm-pix" class="pix-pay-btn">Pagar</button>
    </div>
  `;

    // Eventos
    content.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    content.querySelector('#copy-pix').addEventListener('click', copyPix);
    content.querySelector('#confirm-pix').addEventListener('click', () => confirmPayment(modal));
}

// 🔹 Pagamento via Cartão
function payCard(modal) {
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
    <button class="modal-close close_X"><img src="../img/close_X.svg" alt="Fechar"></button>
    <h2>Pagamento via Cartão de Crédito</h2>
    <input type="text" placeholder="Número do cartão">
    <input type="text" placeholder="Nome no cartão">
    <input type="text" placeholder="Validade MM/AA">
    <input type="text" placeholder="CVV">
    <button id="confirm-card">Pagar</button>
  `;

    // Evento para fechar
    content.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    content.querySelector('#confirm-card').addEventListener('click', () => confirmPayment(modal));
}

// 🔹 Confirmar pagamento
function confirmPayment(modal) {
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
    <h2>Pagamento efetuado com sucesso!</h2>
  `; // sem botão de fechar

    setTimeout(() => {
        modal.remove();
        showCardAfterPayment();
    }, 1500);
}


// 🔹 Função para copiar Pix
function copyPix() {
    const pixKey = document.getElementById("pix-key");
    pixKey.select();
    pixKey.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(pixKey.value);
    alert("Chave Pix copiada!");
}

// 🔹 Mostrar card Agendar consulta após pagamento
function showCardAfterPayment() {
    const content = document.getElementById("card-content");
    content.innerHTML = `
    <h2>Agendar consulta</h2>
    <p class="sub-title">Selecione o dia da semana</p>
    <div class="day-tabs">
      <button class="day-tab active">Segunda</button>
      <button class="day-tab">Terça</button>
      <button class="day-tab">Quarta</button>
      <button class="day-tab">Quinta</button>
      <button class="day-tab">Sexta</button>
      <button class="day-tab">Sábado</button>
    </div>
    <p class="sub-title">Selecione o horário da consulta</p>
    <div class="day-content" id="day-content"></div>
  `;
    showDayHours("Segunda");
}

// 🔹 Mostrar horários
function showDayHours(day) {
    const content = document.getElementById("day-content");
    const hours = [];
    for (let h = 8; h <= 17; h++) {
        if (h === 12) continue;
        hours.push(`${h}:00`);
    }
    let html = `<div class="day-hours">`;
    hours.forEach(hour => html += `<button>${hour}</button>`);
    html += `</div>`;
    content.innerHTML = html;
}

// 🔹 Seleção de dias
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("day-tab")) {
        const tabs = document.querySelectorAll(".day-tab");
        tabs.forEach(tab => tab.classList.remove("active"));
        e.target.classList.add("active");
        showDayHours(e.target.innerText);
    }
});
