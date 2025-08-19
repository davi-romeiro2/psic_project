const { google } = require("googleapis");
const readline = require("readline");

// === CONFIGURAÇÃO ===
const CLIENT_ID = "1080186729861-5mdrtukbmivselhvvl4sl3urlh85neph.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// === URL de autorização ===
const SCOPES = ["https://mail.google.com/"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // importante para gerar refresh token
  scope: SCOPES,
});

console.log("Abra essa URL no navegador e faça login no Gmail:");
console.log(authUrl);

// === Ler o código de autorização ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite o código que apareceu no navegador: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    console.log("\n=== TOKENS GERADOS ===");
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token); // ESTE É O MAIS IMPORTANTE
    console.log("\nCopie o refresh token e cole no server.js");
  } catch (err) {
    console.error("Erro ao gerar tokens:", err);
  }
  rl.close();
});
