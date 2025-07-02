document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
  
    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
    const anuncio = anuncios.find(a => a.id === id);
    if (!anuncio) {
      alert("Anúncio não encontrado.");
      window.location.href = "index.html";
      return;
    }
  
    document.getElementById("anuncioId").value = anuncio.id;
    document.getElementById("titulo").value = anuncio.titulo;
    document.getElementById("descricao").value = anuncio.descricao;
    document.getElementById("categoria").value = anuncio.categoria;
    document.getElementById("local").value = anuncio.local;
  
    document.getElementById("formEditar").addEventListener("submit", e => {
      e.preventDefault();
  
      anuncio.titulo = document.getElementById("titulo").value;
      anuncio.descricao = document.getElementById("descricao").value;
      anuncio.categoria = document.getElementById("categoria").value;
      anuncio.local = document.getElementById("local").value;
  
      const index = anuncios.findIndex(a => a.id === id);
      anuncios[index] = anuncio;
  
      localStorage.setItem("anuncios", JSON.stringify(anuncios));
      window.location.href = "index.html";
    });
  });
  