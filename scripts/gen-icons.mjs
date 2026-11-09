// Gera os ícones do PWA no estilo do convite "Proteção solar e câncer de pele":
// fundo claro com ondas laranja, sol em degradê amarelo → laranja e um chapéu
// de aba larga roxo (proteção), em ilustração chapada com contorno azul-escuro.
//
//   npm run icons
//
// Saída em public/icons/ e public/favicon.svg.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../public/icons/', import.meta.url));
const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url));

const BG = '#FFFAF3'; // fundo claro
const WAVE = '#FFBE5C'; // ondas laranja do convite
const SUN_A = '#FFD54F'; // início do degradê do título
const SUN_B = '#FF9147'; // fim do degradê do título
const PURPLE = '#6E64A8'; // roxo das camisetas
const INK = '#1E1E2E'; // contorno da ilustração

const defs = `
  <defs>
    <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${SUN_A}"/>
      <stop offset="1" stop-color="${SUN_B}"/>
    </linearGradient>
  </defs>`;

// Fundo: ocupa o quadro todo (sangra nas bordas, bom para "maskable").
const background = `
  <rect width="512" height="512" fill="${BG}"/>
  <path d="M0 0H512V70C440 112 380 52 300 78S170 128 96 92 30 70 0 86Z" fill="${WAVE}"/>
  <path d="M0 512V372C70 334 140 392 220 370S360 318 430 350 494 372 512 362V512Z" fill="${WAVE}"/>`;

// Desenho principal em uma grade 512×512, centrado.
const art = `
  <g stroke="${INK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
    <!-- raios do sol -->
    <g stroke="${SUN_B}" stroke-width="20">
      <path d="M256 66V40 M150 110l-18-18 M362 110l18-18 M108 204H82 M430 204h-26"/>
    </g>
    <!-- sol -->
    <circle cx="256" cy="210" r="104" fill="url(#sun)"/>
    <!-- chapéu de aba larga: aba -->
    <path d="M86 330C86 300 166 282 256 282S426 300 426 330 346 372 256 372 86 360 86 330Z" fill="${PURPLE}"/>
    <!-- copa -->
    <path d="M176 318C176 250 210 214 256 214S336 250 336 318C312 330 200 330 176 318Z" fill="${PURPLE}"/>
    <!-- fita laranja -->
    <path d="M181 282C216 294 296 294 331 282L334 304C298 318 214 318 178 304Z" fill="${SUN_B}" stroke-width="10"/>
  </g>`;

/** @param {{ radius: number, scale: number }} o */
function svg({ radius, scale }) {
  const t = 256 * (1 - scale);
  const clip = radius
    ? `<clipPath id="r"><rect width="512" height="512" rx="${radius}"/></clipPath>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  ${defs}${clip ? `<defs>${clip}</defs>` : ''}
  <g${radius ? ' clip-path="url(#r)"' : ''}>
    ${background}
    <g transform="translate(${t} ${t + 14 * scale}) scale(${scale})">${art}</g>
  </g>
</svg>`;
}

// "any": cantos arredondados, desenho grande.
const anySvg = svg({ radius: 112, scale: 0.94 });
// "maskable": fundo sangrado e desenho dentro da zona segura (círculo de 80%).
const maskableSvg = svg({ radius: 0, scale: 0.74 });
// iOS aplica a própria máscara: fundo cheio, sem transparência.
const appleSvg = svg({ radius: 0, scale: 0.86 });

await mkdir(OUT, { recursive: true });
await writeFile(`${OUT}icon.svg`, anySvg);
await writeFile(`${PUBLIC}favicon.svg`, anySvg);

const png = (src, size, file) =>
  sharp(Buffer.from(src)).resize(size, size).png({ compressionLevel: 9 }).toFile(`${OUT}${file}`);

await Promise.all([
  png(anySvg, 192, 'icon-192.png'),
  png(anySvg, 512, 'icon-512.png'),
  png(maskableSvg, 512, 'icon-maskable-512.png'),
  png(appleSvg, 180, 'apple-touch-icon-180.png'),
]);

console.log('Ícones gerados em public/icons/');
