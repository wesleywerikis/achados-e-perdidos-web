const form = document.getElementById("formCadastro");
const msg = document.getElementById("mensagemCadastro");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    msg.style.color = "red";
    msg.textContent = "As senhas não coincidem!";
    return;
  }

  try {
  const resp = await fetch("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, email, senha }),
  });

  let dados = {};
  try {
    dados = await resp.json(); // tenta ler JSON
  } catch (e) {
    console.error("Falha ao ler JSON da resposta:", e);
  }

  if (!resp.ok) {
    msg.style.color = "red";
    msg.textContent =
      dados.erro ||
      `Erro ao cadastrar. Status: ${resp.status} ${resp.statusText}`;
    return;
  }

  msg.style.color = "green";
  msg.textContent =
    dados.mensagem || "Cadastro realizado com sucesso!";

  form.reset();
} catch (err) {
  console.error(err);
  msg.style.color = "red";
  msg.textContent = "Erro de conexão com o servidor.";
}
});