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
      valor: data.valor,
      prazo: data.prazo,
      cidade: data.cidade,
      profissao: data.profissao,
      renda: data.renda,
      conta: data.conta,
      mensagemExtra: data.mensagemExtra
    })
  });

  if (!response.ok) {
    throw new Error("Não foi possível enviar os dados para a planilha.");
  }

  return response.text().catch(function () {
    return "ok";
  });
}