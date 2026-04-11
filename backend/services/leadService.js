async function sendToGoogleSheets(data) {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.includes("COLE_AQUI")) {
    return { ok: true, skipped: true };
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
    throw new Error("Não foi possível concluir sua solicitação no momento.");
  }

  return response.json().catch(function () {
    return { ok: true };
  });
}