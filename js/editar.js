document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  if (!id) {
    alert("ID do anúncio não informado.");
    window.location.href = "../index.html";
    return;
  }

  const form = document.getElementById("formEditar");

  try {
    const resp = await fetch(`/api/anuncio?id=${id}`);
    const dados = await resp.json();

    if (!resp.ok) {
      alert(dados.erro || "Erro ao carregar anúncio.");
      window.location.href = "../index.html";
      return;
    }

    const anuncio = dados.anuncio;
    document.getElementById("anuncioId").value = anuncio.id;
    document.getElementById("titulo").value = anuncio.titulo;
    document.getElementById("descricao").value = anuncio.descricao;
    document.getElementById("categoria").value = anuncio.categoria;
    document.getElementById("local").value = anuncio.local;
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
    window.location.href = "../index.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const categoria = document.getElementById("categoria").value;
    const local = document.getElementById("local").value;

    try {
      const resp = await fetch(`/api/anuncio?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, descricao, categoria, local }),
      });

      const dados = await resp.json();

      if (!resp.ok) {
        alert(dados.erro || "Erro ao salvar alterações.");
        return;
      }

      window.location.href = "../index.html";
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  });
});