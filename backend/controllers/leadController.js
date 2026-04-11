function createLeadPayload(body) {
  return {
    nome: body.nome || "",
    telefone: body.telefone || "",
    valor: body.valor || "",
    prazo: body.prazo || "",
    cidade: body.cidade || "",
    profissao: body.profissao || "",
    renda: body.renda || "",
    conta: body.conta || "",
    mensagemExtra: body.mensagemExtra || ""
  };
}

module.exports = {
  createLeadPayload
};