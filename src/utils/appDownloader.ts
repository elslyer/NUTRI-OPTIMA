/**
 * Helper to trigger application downloads and native Chrome installation
 */

export function downloadStandaloneApp() {
  const targetUrl = window.location.origin;

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NUTRI-OPTIMA — Workforce Nutrition System</title>
  <meta name="description" content="Aplikasi Gizi Presisi & Kebugaran Tenaga Kerja Indonesia">
  <link rel="icon" type="image/svg+xml" href="${targetUrl}/icon.svg">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 24px;
    }
    .card {
      background: #ffffff;
      color: #0f172a;
      max-width: 480px;
      width: 100%;
      border-radius: 24px;
      padding: 36px 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo-container {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px auto;
      background: #ecfdf5;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      font-weight: 700;
      font-size: 11px;
      padding: 5px 12px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      color: #064e3b;
      letter-spacing: -0.5px;
    }
    p {
      color: #475569;
      font-size: 13.5px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 24px;
      border-radius: 14px;
      background: #059669;
      color: #ffffff;
      font-weight: 700;
      text-decoration: none;
      font-size: 15px;
      box-shadow: 0 10px 20px -5px rgba(5, 150, 105, 0.4);
      transition: all 0.2s;
    }
    .btn:hover {
      background: #047857;
      transform: translateY(-2px);
    }
    .tip {
      margin-top: 20px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      font-size: 11.5px;
      color: #64748b;
      text-align: left;
      line-height: 1.5;
    }
    .tip strong {
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-container">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    </div>
    <div class="badge">Aplikasi NUTRI-OPTIMA</div>
    <h1>Membuka Aplikasi...</h1>
    <p>Sistem Rekomendasi Gizi Presisi untuk Tenaga Kerja Indonesia berbasis okupasi, ritme sirkadian shift, dan 100 pangan lokal.</p>
    <a href="${targetUrl}" class="btn" id="launch-btn">Buka NUTRI-OPTIMA Sekarang &rarr;</a>
    <div class="tip">
      💡 <strong>Petunjuk:</strong> Jika browser tidak membuka otomatis dalam 2 detik, klik tombol di atas. Anda juga dapat menyimpan file ini di Desktop untuk membuka aplikasi kapan saja.
    </div>
  </div>
  <script>
    setTimeout(function() {
      window.location.replace("${targetUrl}");
    }, 600);
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'NUTRI-OPTIMA.html');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadDesktopShortcut() {
  const currentUrl = window.location.origin;
  const shortcutContent = `[InternetShortcut]\r\nURL=${currentUrl}\r\nIconIndex=0\r\nIconFile=${currentUrl}/favicon.png\r\n`;
  const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'NUTRI-OPTIMA.url';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openInNewTabForNativeInstall() {
  // Opening the direct URL in a new tab allows Chrome's native omnibox install icon to appear.
  window.open(window.location.origin, '_blank');
}

export function isRunningInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
