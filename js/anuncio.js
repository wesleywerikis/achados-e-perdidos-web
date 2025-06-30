document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-anuncio");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Pegando os dados do formulário
    const formData = new FormData(form);
    const anuncio = {
      titulo: formData.get("titulo"),
      descricao: formData.get("descricao"),
      categoria: formData.get("categoria"),
      local: formData.get("local"),
    };

    // Pegando anúncios salvos no localStorage
    const anunciosStr = localStorage.getItem("anuncios");
    const anuncios = anunciosStr ? JSON.parse(anunciosStr) : [];

    // Adicionando novo anúncio
    anuncios.push(anuncio);

    // Salvando novamente no localStorage
    localStorage.setItem("anuncios", JSON.stringify(anuncios));

    // Redireciona para a página inicial
    window.location.href = "index.html";
  });
});