const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const app = express();
app.use(express.json());
app.use(cors());

// === CONFIGURAÇÃO DO OAUTH2 ===
const CLIENT_ID = "1080186729861-5mdrtukbmivselhvvl4sl3urlh85neph.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost";
const REFRESH_TOKEN = "1//0hpcAC8p5mGAnCgYIARAAGBESNwF-L9IrtAAnsYlp_cQxzQmiO1ZYPDbJaMLeT6TDfZYA_AShPEb9OqPjHcFwUYu1BDtr7bBPfmY"; // gerado com get_token.js

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Função pra enviar email
async function sendMail(destinatario, codigo) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "daviromeiro96@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: '"Suporte MinhaApp" <SEU_EMAIL@gmail.com>',
      to: destinatario,
      subject: "Código de verificação",
      html: `<h2>Seu código de verificação é:</h2>
             <p style="font-size:20px; font-weight:bold;">${codigo}</p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Erro no envio:", error);
    throw error;
  }
}

// === ROTA DO BACKEND ===
app.post("/enviar-codigo", async (req, res) => {
  const { email, codigo } = req.body;
  try {
    await sendMail(email, codigo);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inicia o servidor
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
