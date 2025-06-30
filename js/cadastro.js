const form = document.getElementById("formCadastro");
const msg = document.getElementById("mensagemCadastro");

form.addEventListener("submit", function (e) {
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

  // Recupera usuários existentes ou inicia lista
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verifica se o e-mail já foi cadastrado
  const existe = usuarios.some((u) => u.email === email);
  if (existe) {
    msg.style.color = "red";
    msg.textContent = "Este e-mail já está cadastrado.";
    return;
  }

  // Adiciona novo usuário
  const novoUsuario = { nome, email, senha };
  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  msg.style.color = "green";
  msg.textContent = "Cadastro realizado com sucesso!";

  form.reset();
});
