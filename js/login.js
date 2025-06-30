const formLogin = document.getElementById("formLogin");
const msgLogin = document.getElementById("mensagemLogin");

formLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = usuarios.find(
    (usuario) => usuario.email === email && usuario.senha === senha
  );

  if (usuarioValido) {
    msgLogin.style.color = "green";
    msgLogin.textContent = "Login realizado com sucesso! Redirecionando...";
    
    // Simula login (em sistema real, usaria session/cookie/token)
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));

    setTimeout(() => {
      window.location.href = "index.html"; // redireciona para página inicial
    }, 1500);
  } else {
    msgLogin.style.color = "red";
    msgLogin.textContent = "Email ou senha inválidos!";
  }
});
