<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Vérifiez votre email — Massarek</title>
</head>
<body style="margin:0;padding:0;background:#0a1628;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#1e3a8a,#0e7490);border-radius:16px 16px 0 0;padding:36px 40px;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
               
                <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;vertical-align:middle;">Massarek</span>
              </div>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(241,249,255,0.6);letter-spacing:0.08em;text-transform:uppercase;">AI-Powered Academic Guidance</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#0f1f38;padding:40px;border-left:1px solid rgba(34,211,238,0.1);border-right:1px solid rgba(34,211,238,0.1);">

              <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#f0f9ff;letter-spacing:-0.03em;">
                Vérifiez votre adresse email
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:rgba(148,163,184,1);line-height:1.7;">
                Bonjour <strong style="color:#22d3ee;">{{ $name }}</strong>,
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:rgba(148,163,184,1);line-height:1.7;">
                Bienvenue sur <strong style="color:#f0f9ff;">Massarek</strong> ! Pour activer votre compte et commencer votre parcours d'orientation, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.
              </p>

              <!-- CTA BUTTON -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#2563eb,#0e7490);border-radius:12px;box-shadow:0 0 32px rgba(34,211,238,0.25);">
                    <a href="{{ $verificationLink }}" style="display:inline-block;padding:16px 40px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                      ✓ &nbsp; Vérifier mon compte
                    </a>
                  </td>
                </tr>
              </table>

              <!-- EXPIRY NOTE -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td style="background:rgba(34,211,238,0.06);border-left:3px solid #22d3ee;border-radius:0 8px 8px 0;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                      <strong style="color:#22d3ee;">⏱ Lien expirant</strong><br/>
                      Ce lien de vérification expire dans <strong style="color:#f0f9ff;">24 heures</strong>. Si il expire, vous pouvez en demander un nouveau depuis la page de connexion.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- FALLBACK LINK -->
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;line-height:1.6;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
              </p>
              <p style="margin:0 0 28px;font-size:12px;color:#22d3ee;word-break:break-all;">
                {{ $verificationLink }}
              </p>

              <hr style="border:none;border-top:1px solid rgba(34,211,238,0.08);margin:0 0 24px;"/>

              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
                Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email en toute sécurité.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#071120;border-radius:0 0 16px 16px;border:1px solid rgba(34,211,238,0.08);border-top:none;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 12px;font-size:13px;color:#475569;">
                <a href="{{ $frontendUrl }}" style="color:#22d3ee;text-decoration:none;margin:0 12px;">Visiter le site</a>
                <span style="color:#1e3a5f;">|</span>
                <a href="mailto:contact@massarek.ma" style="color:#22d3ee;text-decoration:none;margin:0 12px;">Support</a>
                <span style="color:#1e3a5f;">|</span>
                <a href="{{ $frontendUrl }}/privacy" style="color:#22d3ee;text-decoration:none;margin:0 12px;">Confidentialité</a>
              </p>
              <p style="margin:0;font-size:12px;color:#334155;">
                © 2026 Massarek. AI-Powered Academic Guidance Platform. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
