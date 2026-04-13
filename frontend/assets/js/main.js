document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("leadForm");
  const statusMsg = document.getElementById("statusMsg");
  const telefoneInput = document.getElementById("telefone");
  const valorInput = document.getElementById("valor");

  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  const cidadesPorEstado = {
    BA: [
      "Salvador",
      "Camaçari",
      "Candeias",
      "Dias D’Ávila",
      "Lauro de Freitas",
      "Simões Filho"
    ],
    SE: [
      "Aracaju",
      "Barra dos Coqueiros",
      "Estância",
      "Itabaiana",
      "Itaporanga D’Ajuda",
      "Lagarto",
      "Laranjeiras",
      "Maruim",
      "Nossa Senhora do Socorro",
      "Pedra Branca",
      "Pirambu",
      "Riachuelo",
      "Rosário do Catete",
      "São Cristóvão"
    ]
  };

  estadoSelect.addEventListener("change", function () {
    const estado = this.value;

    // Limpa cidades
    cidadeSelect.innerHTML = '<option value="">Selecione</option>';

    if (!estado || !cidadesPorEstado[estado]) return;

    cidadesPorEstado[estado].forEach(function (cidade) {
      const option = document.createElement("option");
      option.value = cidade;
      option.textContent = cidade;
      cidadeSelect.appendChild(option);
    });
  });

  function showStatus(type, text) {
    if (!statusMsg) return;
    statusMsg.className = "status " + type;
    statusMsg.textContent = text;
  }

  function getWhatsAppLink(message = "Olá, quero fazer uma simulação de empréstimo.") {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function initWhatsAppLinks() {
    const links = document.querySelectorAll(".whatsapp-link");

    links.forEach(function (link) {
      const message =
        link.getAttribute("data-message") ||
        "Olá, quero fazer uma simulação de empréstimo.";

      link.href = getWhatsAppLink(message);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function startCountdown() {
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");
    const label = document.getElementById("countdownLabel");
    const countdownBox = document.getElementById("countdownBox");

    if (!h || !m || !s || !label || !countdownBox) return;

    function update() {
      const now = new Date();
      const end = new Date();
      end.setHours(18, 0, 0, 0);

      let isTomorrow = false;

      if (now.getTime() > end.getTime()) {
        end.setDate(end.getDate() + 1);
        isTomorrow = true;
      }

      const diff = end.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      h.textContent = String(hours).padStart(2, "0");
      m.textContent = String(minutes).padStart(2, "0");
      s.textContent = String(seconds).padStart(2, "0");

      label.textContent = isTomorrow
        ? "Encerra amanhã às 18h"
        : "Encerra hoje às 18h";

      countdownBox.classList.remove("warning", "danger", "pulse");

      if (diff <= 15 * 60 * 1000) {
        countdownBox.classList.add("danger", "pulse");
      } else if (diff <= 60 * 60 * 1000) {
        countdownBox.classList.add("warning");
      }
    }

    update();
    setInterval(update, 1000);
  }

  function formatPhone(value) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) {
      return "(" + numbers.slice(0, 2) + ") " + numbers.slice(2);
    }

    return "(" + numbers.slice(0, 2) + ") " + numbers.slice(2, 7) + "-" + numbers.slice(7, 11);
  }

  function formatCurrency(value) {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";

    return (Number(numbers) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function validateFormData(data) {
    const phoneNumbers = data.telefone.replace(/\D/g, "");
    const privacyCheckbox = document.getElementById("aceitePrivacidade");

    if (!data.nome || data.nome.length < 3) {
      throw new Error("Informe seu nome completo.");
    }

    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      throw new Error("Informe um WhatsApp válido com DDD.");
    }

    if (!data.profissao) throw new Error("Selecione a profissão.");
    if (!data.estado) throw new Error("Selecione o estado.");
    if (!data.cidade) throw new Error("Selecione a cidade.");
    if (!data.carteira) throw new Error("Informe sobre a carteira.");
    if (!data.tempoCarteira) throw new Error("Informe o tempo de carteira.");
    if (!data.salario) throw new Error("Informe o salário.");

    if (privacyCheckbox && !privacyCheckbox.checked) {
      throw new Error("É necessário autorizar o uso das informações para continuar.");
    }
  }

  function buildMessage(data) {
    return encodeURIComponent(
  `Olá, quero uma simulação.

  Nome: ${data.nome}
  WhatsApp: ${data.telefone}
  Profissão: ${data.profissao}
  Empresa: ${data.empresa || "-"}
  Estado: ${data.estado}
  Cidade: ${data.cidade}
  Carteira assinada: ${data.carteira}
  Tempo de carteira: ${data.tempoCarteira}
  Salário: ${data.salario}
  Observação: ${data.mensagemExtra || "-"}`
    );
  }

  startCountdown();
  initWhatsAppLinks();

  if (!form || !statusMsg || !telefoneInput || !valorInput) {
    return;
  }

  telefoneInput.addEventListener("input", function (e) {
    e.target.value = formatPhone(e.target.value);
  });

  valorInput.addEventListener("input", function (e) {
    e.target.value = formatCurrency(e.target.value);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      nome: document.getElementById("nome").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      profissao: document.getElementById("profissao").value,
      empresa: document.getElementById("empresa").value.trim(),
      estado: document.getElementById("estado").value,
      cidade: document.getElementById("cidade").value,
      carteira: document.getElementById("carteira").value,
      tempoCarteira: document.getElementById("tempoCarteira").value,
      salario: document.getElementById("salario").value.trim(),
      mensagemExtra: document.getElementById("mensagemExtra").value.trim()
    };

    const botao = form.querySelector("button[type='submit']");
    if (!botao) return;

    botao.disabled = true;
    botao.textContent = "Enviando...";
    statusMsg.className = "status";
    statusMsg.textContent = "";

    try {
      validateFormData(data);

      if (typeof sendToGoogleSheets !== "function") {
        throw new Error("Função de envio não carregada.");
      }

      await sendToGoogleSheets(data);

      const mensagem = buildWhatsAppMessage(data);
      const url = getWhatsAppLink(mensagem);

      sessionStorage.setItem("emprestimo_whatsapp_url", url);
      sessionStorage.setItem("emprestimo_lead_nome", data.nome);

      window.location.href = "./obrigado.html";
    } catch (error) {
      showStatus("error", error.message || "Não foi possível concluir sua solicitação. Tente novamente.");
      console.error(error);
    } finally {
      botao.disabled = false;
      botao.textContent = "Enviar e continuar no WhatsApp";
    }
  });
});