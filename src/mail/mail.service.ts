import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendResetPassword(email: string, nom: string, token: string) {
    const resetUrl = `http://192.168.1.26:5173/Bibliotheque/reset-password?token=${encodeURIComponent(token)}`;

    await this.mailer.sendMail({
      to: email,
      subject: '🔐 Réinitialisation de votre mot de passe — SENBibliothèque',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { margin:0; padding:0; background:#0D0F1C; font-family:'Inter',-apple-system,sans-serif; }
            .container { max-width:520px; margin:40px auto; padding:0 16px; }
            .card { background: linear-gradient(135deg, #12162A, #1a1f3c); border-radius:24px; border:1px solid rgba(255,255,255,0.08); overflow:hidden; }
            .header { background: linear-gradient(135deg, #6366F1, #F4A261); padding:32px; text-align:center; }
            .header h1 { color:white; margin:0; font-size:22px; font-weight:900; letter-spacing:-0.5px; }
            .header p { color:rgba(255,255,255,0.8); margin:4px 0 0; font-size:13px; }
            .body { padding:32px; }
            .greeting { color:rgba(255,255,255,0.9); font-size:15px; margin-bottom:12px; }
            .text { color:rgba(255,255,255,0.5); font-size:13px; line-height:1.6; margin-bottom:28px; }
            .btn { display:block; background:linear-gradient(135deg,#6366F1,#F4A261); color:white; text-decoration:none; text-align:center; padding:14px 32px; border-radius:14px; font-weight:800; font-size:14px; margin-bottom:20px; }
            .warning { background:rgba(244,162,97,0.1); border:1px solid rgba(244,162,97,0.2); border-radius:12px; padding:12px 16px; color:rgba(244,162,97,0.8); font-size:12px; margin-bottom:24px; }
            .footer { border-top:1px solid rgba(255,255,255,0.06); padding-top:20px; color:rgba(255,255,255,0.2); font-size:11px; text-align:center; }
            .logo { font-size:28px; margin-bottom:8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">📚</div>
                <h1>SENBibliothèque</h1>
                <p>keur xam-xam</p>
              </div>
              <div class="body">
                <p class="greeting">Bonjour <strong style="color:white">${nom}</strong>,</p>
                <p class="text">
                  Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau. Ce lien est valable pendant <strong style="color:rgba(255,255,255,0.8)">15 minutes</strong>.
                </p>
                <a href="${resetUrl}" class="btn">
                  🔐 Réinitialiser mon mot de passe
                </a>
                <div class="warning">
                  ⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe ne sera pas modifié.
                </div>
                <div class="footer">
                  <p>© 2026 SENBibliothèque — Tous droits réservés</p>
                  <p style="margin-top:4px">Ce lien expirera dans 15 minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  }

  async sendWelcome(email: string, nom: string) {
    await this.mailer.sendMail({
      to: email,
      subject: '🎉 Bienvenue sur SENBibliothèque !',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { margin:0; padding:0; background:#0D0F1C; font-family:'Inter',-apple-system,sans-serif; }
            .container { max-width:520px; margin:40px auto; padding:0 16px; }
            .card { background:linear-gradient(135deg,#12162A,#1a1f3c); border-radius:24px; border:1px solid rgba(255,255,255,0.08); overflow:hidden; }
            .header { background:linear-gradient(135deg,#6366F1,#F4A261); padding:32px; text-align:center; }
            .header h1 { color:white; margin:0; font-size:22px; font-weight:900; }
            .body { padding:32px; }
            .text { color:rgba(255,255,255,0.5); font-size:13px; line-height:1.7; margin-bottom:20px; }
            .feature { display:flex; align-items:center; gap:12px; padding:10px 14px; background:rgba(99,102,241,0.08); border-radius:12px; margin-bottom:8px; color:rgba(255,255,255,0.7); font-size:13px; }
            .btn { display:block; background:linear-gradient(135deg,#6366F1,#F4A261); color:white; text-decoration:none; text-align:center; padding:14px; border-radius:14px; font-weight:800; font-size:14px; margin-top:24px; }
            .footer { border-top:1px solid rgba(255,255,255,0.06); margin-top:24px; padding-top:16px; color:rgba(255,255,255,0.2); font-size:11px; text-align:center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div style="font-size:32px;margin-bottom:8px">📚</div>
                <h1>Bienvenue, ${nom} ! 🎉</h1>
                <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0">Votre compte SENBibliothèque est créé</p>
              </div>
              <div class="body">
                <p class="text">
                  Nous sommes ravis de vous accueillir sur <strong style="color:white">SENBibliothèque</strong>, votre espace de lecture et de découverte. Votre compte est maintenant actif et prêt à être utilisé.
                </p>
                <div class="feature"><span>📖</span> Parcourez notre catalogue de livres</div>
                <div class="feature"><span>🔖</span> Empruntez jusqu'à 15 jours</div>
                <div class="feature"><span>📋</span> Suivez vos emprunts en temps réel</div>
                <a href="http://192.168.1.26:5173/Bibliotheque/" class="btn">
                  Accéder à ma bibliothèque →
                </a>
                <div class="footer">
                  <p>© 2026 SENBibliothèque — keur xam-xam</p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  }
}