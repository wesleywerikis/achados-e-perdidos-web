require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.resolve(__dirname, "..");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const API_HANDLERS = {
  "/api/login": "../api/login.js",
  "/api/usuarios": "../api/usuarios.js",
  "/api/anuncios": "../api/anuncios.js",
  "/api/anuncio": "../api/anuncio.js",
};

function criarRequestVercel(nodeReq, body) {
  const req = new Readable({ read() {} });
  if (body.length) req.push(body);
  req.push(null);
  req.method = nodeReq.method;
  req.headers = nodeReq.headers;
  req.url = nodeReq.url;
  return req;
}

function criarResponseVercel(nodeRes) {
  const res = {
    statusCode: 200,
    setHeader(name, value) {
      nodeRes.setHeader(name, value);
    },
    end(data) {
      nodeRes.statusCode = this.statusCode;
      nodeRes.end(data);
    },
  };
  return res;
}

function lerBody(nodeReq) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    nodeReq.on("data", (chunk) => chunks.push(chunk));
    nodeReq.on("end", () => resolve(Buffer.concat(chunks)));
    nodeReq.on("error", reject);
  });
}

function servirArquivoEstatico(urlPath, nodeRes) {
  let filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  if (!filePath.startsWith(ROOT)) {
    nodeRes.writeHead(403);
    nodeRes.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    nodeRes.writeHead(404);
    nodeRes.end("Not Found");
    return;
  }

  const ext = path.extname(filePath);
  nodeRes.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(nodeRes);
}

async function rotearApi(pathname, nodeReq, nodeRes, body) {
  const handlerPath = API_HANDLERS[pathname];
  if (!handlerPath) {
    nodeRes.writeHead(404, { "Content-Type": "application/json" });
    nodeRes.end(JSON.stringify({ erro: "Rota não encontrada." }));
    return;
  }

  const handler = require(path.join(__dirname, handlerPath));
  const req = criarRequestVercel(nodeReq, body);
  const res = criarResponseVercel(nodeRes);

  try {
    await handler(req, res);
  } catch (err) {
    console.error(`Erro em ${pathname}:`, err);
    if (!nodeRes.headersSent) {
      nodeRes.writeHead(500, { "Content-Type": "application/json" });
      nodeRes.end(JSON.stringify({ erro: "Erro interno no servidor local." }));
    }
  }
}

const server = http.createServer(async (nodeReq, nodeRes) => {
  const url = new URL(nodeReq.url, `http://localhost:${PORT}`);
  const pathname = url.pathname.replace(/\/$/, "") || "/";

  if (pathname.startsWith("/api/")) {
    const apiPath = pathname.endsWith(".js") ? pathname.slice(0, -3) : pathname;
    const body = await lerBody(nodeReq);
    await rotearApi(apiPath, nodeReq, nodeRes, body);
    return;
  }

  servirArquivoEstatico(url.pathname, nodeRes);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("");
    console.error(`  ERRO: a porta ${PORT} já está em uso.`);
    console.error("");
    console.error("  Opções:");
    console.error(`    1. Use outra porta:  PORT=3001 npm run dev`);
    console.error("    2. Encerre o processo (Git Bash / PowerShell):");
    console.error("       netstat -ano | findstr :3000");
    console.error("       taskkill /PID <numero> /F");
    console.error("");
    process.exit(1);
  }

  console.error("Erro ao iniciar servidor:", err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log("");
  console.log("  Servidor local rodando!");
  console.log(`  Acesse: http://localhost:${PORT}`);
  console.log("");

  if (!process.env.POSTGRES_URL) {
    console.warn("  AVISO: POSTGRES_URL não definida.");
    console.warn("  Copie .env.example para .env.local e configure o banco.");
    console.log("");
  }
});
