/**
 * Helper to trigger application downloads and native Chrome installation
 */

export function downloadStandaloneApp() {
  // Trigger file download from backend endpoint
  const link = document.createElement('a');
  link.href = '/api/download-app';
  link.setAttribute('download', 'NUTRI-OPTIMA-App.html');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadDesktopShortcut() {
  const currentUrl = window.location.origin;
  const shortcutContent = `[InternetShortcut]\nURL=${currentUrl}\nIconIndex=0\nIconFile=${currentUrl}/favicon.png\n`;
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
  // In an iframe (like AI Studio preview), Chrome prohibits the native install prompt.
  // Opening the direct URL in a new tab allows Chrome's omnibox install icon to appear.
  window.open(window.location.origin, '_blank');
}

export function isRunningInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
