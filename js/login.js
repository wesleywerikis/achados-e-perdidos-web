const formLogin = document.getElementById("formLogin");
const msgLogin = document.getElementById("mensagemLogin");

formLogin.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  msgLogin.textContent = "";
  msgLogin.style.color = "inherit";

  try {
    const resp = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    let dados = {};
    try {
      dados = await resp.json();
    } catch (e) {
      console.error("Falha ao ler JSON da resposta:", e);
    }

    if (!resp.ok) {
      msgLogin.style.color = "red";
      msgLogin.textContent =
        dados.erro ||
        `Falha no login. Status: ${resp.status} ${resp.statusText}`;
      return;
    }

    if (dados.usuario) {
      localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));
    }

    msgLogin.style.color = "green";
    msgLogin.textContent =
      dados.mensagem || "Login realizado com sucesso! Redirecionando...";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  } catch (err) {
    console.error(err);
    msgLogin.style.color = "red";
    msgLogin.textContent = "Erro de conexão com o servidor.";
  }
});