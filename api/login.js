const { getClient } = require("./db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ erro: "Método não permitido" }));
  }

  try {
    let body = "";
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", resolve);
      req.on("error", reject);
    });

    let parsed = {};
    try {
      parsed = JSON.parse(body || "{}");
    } catch (e) {
      console.error("Erro ao fazer parse do JSON:", e);
    }

    const { email, senha } = parsed;

    if (!email || !senha) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ erro: "Email e senha são obrigatórios." })
      );
    }

    const client = await getClient();

    const result = await client.query(
      `SELECT id, nome, email 
         FROM usuarios 
        WHERE email = $1 AND senha = $2`,
      [email, senha]
    );

    await client.end();

    if (result.rowCount === 0) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ erro: "Email ou senha inválidos." })
      );
    }

    const usuario = result.rows[0];

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        mensagem: "Login realizado com sucesso!",
        usuario,
      })
    );
  } catch (err) {
    console.error("ERRO AO FAZER LOGIN:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        erro: "Erro interno ao fazer login.",
        detalhe: err.message,
      })
    );
  }
};