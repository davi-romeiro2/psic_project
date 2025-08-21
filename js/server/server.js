const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());
app.use(cors());

// Inicializa o Firebase Admin SDK
const serviceAccount = require("../../psicproject-8fd77-firebase-adminsdk-fbsvc-77a1fac505.json"); // chave do seu projeto Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// === CONFIGURAÇÃO DO OAUTH2 ===
const CLIENT_ID = "1080186729861-5mdrtukbmivselhvvl4sl3urlh85neph.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost";
const REFRESH_TOKEN = "1//0hpcAC8p5mGAnCgYIARAAGBESNwF-L9IrtAAnsYlp_cQxzQmiO1ZYPDbJaMLeT6TDfZYA_AShPEb9OqPjHcFwUYu1BDtr7bBPfmY";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Função pra enviar email
async function sendMail(destinatario, codigo) {
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
    from: '"Inspirare Psicologia" <SEU_EMAIL@gmail.com>',
    to: destinatario,
    subject: "Código de verificação",
    html: `<div style="font-family: 'Segoe UI', sans-serif; background:#f5f5f5; padding:30px; border-radius:10px; text-align:center; max-width:400px; margin:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="color:#3A503D; margin-bottom:20px;">Código de verificação</h2>
      <p style="font-size:22px; font-weight:bold; color:#BB8991; background:#fff; padding:15px; border-radius:8px; display:inline-block;">${codigo}</p>
      <p style="margin-top:20px; font-size:14px; color:#555;">Use este código para redefinir sua senha. Ele é válido por 10 minutos.</p>
      <p style="font-size:12px; color:#999; margin-top:30px;">Se você não solicitou a redefinição de senha, ignore este email.</p>
    </div>`
  };

  await transporter.sendMail(mailOptions);
}

// === ROTA DO BACKEND ===
app.post("/enviar-codigo", async (req, res) => {
  const { email, codigo } = req.body; // usar 'email' aqui
  if (!email) return res.json({ success: false, error: "Email ou nome não fornecido" });

  try {
    const usuariosRef = db.collection("usuarios");

    // Consulta por email
    const emailQuery = await usuariosRef.where("email", "==", email).get();
    // Consulta por nome
    const nomeQuery = await usuariosRef.where("nome", "==", email).get();

    if (emailQuery.empty && nomeQuery.empty) {
      return res.json({ success: false, error: "Usuário não encontrado" });
    }

    // Se encontrou em qualquer uma das consultas, envia o código
    // Precisa pegar o email real do usuário se ele digitou o nome
    let destinatario;
    if (!emailQuery.empty) {
      destinatario = emailQuery.docs[0].data().email;
    } else {
      destinatario = nomeQuery.docs[0].data().email;
    }

    await sendMail(destinatario, codigo);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inicia o servidor
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
