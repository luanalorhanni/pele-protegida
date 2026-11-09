// Gera public/og-image.jpg (1200×630), a imagem de prévia do link,
// a partir de scripts/og/og.html, usando o Chrome/Chromium instalado.
//
//   npm run og
//   CHROME_PATH=/caminho/do/chrome npm run og   (se o Chrome não for encontrado)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const TEMPLATE = fileURLToPath(new URL('./og/og.html', import.meta.url));
const OUT = fileURLToPath(new URL('../public/og-image.jpg', import.meta.url));

const candidates = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome não encontrado. Defina CHROME_PATH com o caminho do executável.');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'pele-og-'));
const shot = join(dir, 'og.png');
try {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=3000', // espera as fontes carregarem
      `--user-data-dir=${join(dir, 'profile')}`,
      `--screenshot=${shot}`,
      pathToFileURL(TEMPLATE).href,
    ],
    { stdio: 'ignore' },
  );
  await sharp(shot)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .flatten({ background: '#FFFAF3' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(OUT);
  const { size } = await sharp(OUT).metadata().then(() => import('node:fs').then((fs) => fs.statSync(OUT)));
  console.log(`Imagem de prévia gerada: public/og-image.jpg (${Math.round(size / 1024)} KB)`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
