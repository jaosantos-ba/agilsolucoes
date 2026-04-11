async function sendToGoogleSheets(data) {
  if (!CONFIG.appsScriptUrl) {
    throw new Error("URL do Google Sheets não configurada.");
  }

  const response = await fetch(CONFIG.appsScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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
    throw new Error("Erro ao enviar dados.");
  }

  return response.json().catch(() => ({ ok: true }));
}