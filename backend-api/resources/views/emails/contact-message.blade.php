<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message de contact Massarek</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        width: 100% !important;
        padding: 16px !important;
      }
      .email-card {
        border-radius: 20px !important;
      }
      .email-content,
      .email-footer,
      .details-cell {
        padding: 20px !important;
      }
      .email-title {
        font-size: 22px !important;
      }
      .email-copy,
      .details-label,
      .details-value {
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;background:#f5f7fb;color:#333;font-size:16px;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f7fb;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-wrapper" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,0.08);margin:0 auto;">
          <tr>
            <td class="email-header" style="padding:32px 32px 24px;background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#ffffff;text-align:center;">
              <h1 class="email-title" style="margin:0;font-size:26px;letter-spacing:-0.03em;">Nouveau message de contact</h1>
              <p style="margin:12px 0 0;font-size:15px;opacity:0.88;">Massarek reçoit un message depuis le formulaire de contact.</p>
            </td>
          </tr>
          <tr>
            <td class="email-content" style="padding:32px 32px 24px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">Bonjour,</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#334155;">Vous avez reçu un nouveau message via le formulaire de contact Massarek.</p>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;">
                <tr>
                  <td class="details-cell" style="padding:24px;">
                    <p class="details-label" style="margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a;">Nom</p>
                    <p class="details-value" style="margin:0 0 18px;font-size:15px;color:#475569;">{{ $name }}</p>
                    <p class="details-label" style="margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a;">Email</p>
                    <p class="details-value" style="margin:0 0 18px;font-size:15px;color:#475569;word-break:break-word;"><a href="mailto:{{ $email }}" style="color:#0ea5e9;text-decoration:none;">{{ $email }}</a></p>
                    <p class="details-label" style="margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a;">Message</p>
                    <p class="details-value" style="margin:0;font-size:15px;color:#475569;white-space:pre-wrap;word-break:break-word;">{{ $messageBody }}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-footer" style="padding:24px 32px 32px;background:#f8fafc;text-align:center;color:#64748b;font-size:14px;">
              <p style="margin:0;">Ce message a été envoyé depuis le site Massarek.</p>
              <p style="margin:8px 0 0;">Répondez directement à l'expéditeur pour suivre la conversation.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
