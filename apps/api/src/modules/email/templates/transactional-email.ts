interface TransactionalEmailOptions {
  preheader: string;
  eyebrow: string;
  title: string;
  greeting: string;
  body: string;
  actionLabel: string;
  actionUrl: string;
  expiry: string;
  securityNote: string;
}

export function transactionalEmailTemplate(options: TransactionalEmailOptions): string {
  const safe = {
    preheader: escapeHtml(options.preheader),
    eyebrow: escapeHtml(options.eyebrow),
    title: escapeHtml(options.title),
    greeting: escapeHtml(options.greeting),
    body: escapeHtml(options.body),
    actionLabel: escapeHtml(options.actionLabel),
    actionUrl: escapeHtml(options.actionUrl),
    expiry: escapeHtml(options.expiry),
    securityNote: escapeHtml(options.securityNote),
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>${safe.title}</title>
    <style>
      @media only screen and (max-width: 620px) {
        .email-shell { padding: 24px 12px !important; }
        .email-card { padding: 28px 22px !important; }
        .email-title { font-size: 28px !important; line-height: 34px !important; }
        .email-button { display: block !important; text-align: center !important; }
      }
    </style>
  </head>
  <body style="margin:0;background:#0c111b;color:#f4f1ea;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safe.preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0c111b" style="width:100%;background:#0c111b;">
      <tr>
        <td class="email-shell" align="center" style="padding:48px 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
            <tr>
              <td style="padding:0 0 22px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="40" height="40" align="center" bgcolor="#3ecf9c" style="width:40px;height:40px;border-radius:12px;color:#0c111b;font-size:22px;font-weight:800;line-height:40px;">&#10022;</td>
                    <td style="padding-left:12px;color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.3px;">Northstar</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-card" bgcolor="#141b27" style="padding:42px;border:1px solid #303a4a;border-radius:20px;background:#141b27;">
                <p style="margin:0 0 14px;color:#3ecf9c;font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">${safe.eyebrow}</p>
                <h1 class="email-title" style="margin:0 0 18px;color:#ffffff;font-size:34px;line-height:40px;font-weight:800;letter-spacing:-0.8px;">${safe.title}</h1>
                <p style="margin:0 0 12px;color:#f4f1ea;font-size:16px;line-height:26px;font-weight:600;">${safe.greeting}</p>
                <p style="margin:0 0 28px;color:#b5bdcb;font-size:15px;line-height:25px;">${safe.body}</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;">
                  <tr>
                    <td bgcolor="#3ecf9c" style="border-radius:12px;">
                      <a class="email-button" href="${safe.actionUrl}" style="display:inline-block;padding:15px 24px;color:#08120f;font-size:15px;font-weight:800;text-decoration:none;border-radius:12px;">${safe.actionLabel}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;color:#8f99aa;font-size:13px;line-height:21px;">${safe.expiry}</p>
                <p style="margin:0;color:#8f99aa;font-size:13px;line-height:21px;">${safe.securityNote}</p>
                <div style="height:1px;margin:30px 0 22px;background:#303a4a;"></div>
                <p style="margin:0 0 8px;color:#8f99aa;font-size:12px;line-height:19px;">If the button does not work, copy and paste this secure link:</p>
                <p style="margin:0;color:#3ecf9c;font-size:12px;line-height:19px;word-break:break-all;"><a href="${safe.actionUrl}" style="color:#3ecf9c;text-decoration:underline;">${safe.actionUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 18px 0;color:#737e90;font-size:12px;line-height:19px;">Northstar secure account services</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character] ?? character;
  });
}
