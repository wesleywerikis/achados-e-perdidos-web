const { getClient } = require("./db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const id = Number(url.searchParams.get("id"));

  if (!id) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ erro: "ID do anúncio é obrigatório." }));
  }

  try {
    const client = await getClient();

    if (req.method === "GET") {
      const result = await client.query(
        `SELECT 
           id,
           titulo,
           descricao,
           categoria,
           local,
           dono_email AS dono,
           criado_em
         FROM anuncios
         WHERE id = $1`,
        [id]
      );

      await client.end();

      if (result.rowCount === 0) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ erro: "Anúncio não encontrado." }));
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ anuncio: result.rows[0] }));
    }

    if (req.method === "PUT") {
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => (body += chunk));
        req.on("end", resolve);
        req.on("error", reject);
      });

      let parsed = {};
      try {
        parsed = JSON.parse(body || "{}");
      } catch (e) {
        console.error("Erro ao parsear JSON:", e);
      }

      const { titulo, descricao, categoria, local } = parsed;

      if (!titulo || !descricao || !categoria || !local) {
        await client.end();
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ erro: "Todos os campos são obrigatórios." })
        );
      }

      const result = await client.query(
        `UPDATE anuncios
            SET titulo = $1,
                descricao = $2,
                categoria = $3,
                local = $4
          WHERE id = $5
          RETURNING id, titulo, descricao, categoria, local, dono_email AS dono, criado_em`,
        [titulo, descricao, categoria, local, id]
      );

      await client.end();

      if (result.rowCount === 0) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ erro: "Anúncio não encontrado." }));
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          mensagem: "Anúncio atualizado com sucesso!",
          anuncio: result.rows[0],
        })
      );
    }

    if (req.method === "DELETE") {
      const result = await client.query(
        "DELETE FROM anuncios WHERE id = $1",
        [id]
      );

      await client.end();

      if (result.rowCount === 0) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ erro: "Anúncio não encontrado." }));
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ mensagem: "Anúncio excluído com sucesso!" })
      );
    }

    await client.end();
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ erro: "Método não permitido." }));
  } catch (err) {
    console.error("ERRO EM /api/anuncio:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        erro: "Erro interno ao processar anúncio.",
        detalhe: err.message,
      })
    );
  }
};