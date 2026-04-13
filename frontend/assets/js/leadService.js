async function sendToGoogleSheets(data) {
  if (!CONFIG || !CONFIG.appsScriptUrl) {
    throw new Error("URL do Google Sheets não configurada.");
  }

  const response = await fetch(CONFIG.appsScriptUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
    data: new Date().toISOString(),
    nome: data.nome,
    telefone: data.telefone,
    profissao: data.profissao,
    empresa: data.empresa,
    estado: data.estado,
    cidade: data.cidade,
    carteira: data.carteira,
    tempoCarteira: data.tempoCarteira,
    salario: data.salario,
    mensagemExtra: data.mensagemExtra,
    status: "Novo",
    origem: "Site",
    valorAprovado: ""
    })
  });

  if (!response.ok) {
    throw new Error("Não foi possível enviar os dados para a planilha.");
  }

  return response.text().catch(function () {
    return "ok";
  });
}