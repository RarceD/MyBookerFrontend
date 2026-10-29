// Genera las páginas comerciales de MeApunto (web/paginas.mjs) como HTML estático dentro de public/, más el sitemap,
// el robots.txt y la hoja de estilos. Vite las copia tal cual a dist/ y el nginx del servidor las sirve antes que la app.
//   node web/generar.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { CONTACTO, PAGINAS } from './paginas.mjs';

const WEB = 'https://meapunto.online';
const TITULAR = 'HEXENTA SOFTWARE SL · CIF B22735054 · Paseo Media Luna 5, 09001 Burgos (España)';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `/* Páginas comerciales de MeApunto (web/generar.mjs). Mismos colores que la app: fondo oscuro y naranja #FF8400. */
:root { --fondo: #0f1117; --superficie: #16181f; --tarjeta: #1e2028; --borde: #2c2f3e; --texto: #f0f0f5; --suave: #a0a3b1; --naranja: #FF8400; --naranja-claro: #ffb347; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--fondo); color: var(--texto); font: 400 16px/1.6 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
a { color: var(--naranja-claro); }
.saltar { position: absolute; left: -9999px; } .saltar:focus { left: 16px; top: 16px; background: var(--tarjeta); padding: 8px 12px; z-index: 10; }
.envoltura { width: min(760px, 100% - 32px); margin: 0 auto; }
.cabecera { background: var(--superficie); border-bottom: 1px solid var(--borde); }
.cabecera .envoltura { width: min(1040px, 100% - 32px); display: flex; align-items: center; gap: 16px; min-height: 64px; }
.marca { display: flex; align-items: center; gap: 8px; color: var(--texto); text-decoration: none; font-weight: 700; font-size: 18px; margin-right: auto; }
.marca img { width: 32px; height: 32px; }
.acceso { color: var(--suave); text-decoration: none; font-weight: 600; font-size: 14px; }
.acceso:hover { color: var(--texto); }
.boton { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 16px; text-decoration: none; border: 2px solid var(--naranja); color: var(--naranja-claro); transition: transform .15s cubic-bezier(.23,1,.32,1); }
.boton-principal { background: var(--naranja); color: #16181f; }
.boton:active { transform: scale(.98); }
.boton:focus-visible, a:focus-visible { outline: 3px solid var(--naranja-claro); outline-offset: 2px; }
.cabecera .boton { min-height: 40px; padding: 8px 16px; font-size: 14px; }
main { padding: 48px 0 64px; }
h1 { font-size: clamp(32px, 6vw, 48px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 16px; text-wrap: balance; }
h2 { font-size: 24px; line-height: 1.3; margin: 48px 0 16px; }
.entrada { font-size: 18px; color: var(--suave); margin: 0 0 24px; text-wrap: pretty; }
.acciones { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.prueba { margin: 0; padding: 16px; border: 1px solid var(--borde); border-radius: 12px; background: var(--tarjeta); }
.aviso { padding: 16px; border: 1px solid var(--borde); border-radius: 12px; background: var(--tarjeta); color: var(--suave); }
.pasos, .lista { padding-left: 24px; display: grid; gap: 12px; margin: 0; }
.lista { list-style: disc; }
.preguntas details { border-top: 1px solid var(--borde); padding: 12px 0; }
.preguntas details:last-child { border-bottom: 1px solid var(--borde); }
.preguntas summary { cursor: pointer; font-weight: 600; }
.preguntas p { color: var(--suave); margin: 8px 0 0; }
.cierre { margin-top: 48px; padding: 24px; border: 1px solid var(--borde); border-radius: 16px; background: var(--tarjeta); display: grid; gap: 16px; }
.cierre p { margin: 0; }
.pie { border-top: 1px solid var(--borde); padding: 32px 0; color: var(--suave); font-size: 14px; }
.pie nav { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 12px; }
.pie a { color: var(--suave); }
@media (max-width: 520px) { .acciones { display: grid; } .acciones .boton { width: 100%; } .acceso { display: none; } }
@media (prefers-reduced-motion: reduce) { .boton { transition: none; } }
`;

const enlaces = PAGINAS.map((p) => `<a href="${p.ruta}">${esc(p.h1.split(':')[0])}</a>`).join('\n        ');

function pagina(p) {
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const app = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'MeApunto', url: WEB,
    applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: p.descripcion };
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(p.tituloSeo)}</title>
  <meta name="description" content="${esc(p.descripcion)}" />
  <link rel="canonical" href="${WEB}${p.ruta}" />
  <meta property="og:title" content="${esc(p.tituloSeo)}" />
  <meta property="og:description" content="${esc(p.descripcion)}" />
  <meta property="og:url" content="${WEB}${p.ruta}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_ES" />
  <meta name="theme-color" content="#0f1117" />
  <link rel="icon" href="/images/logo.png" />
  <link rel="stylesheet" href="/web.css" />
  <script type="application/ld+json">${JSON.stringify(app)}</script>
  <script type="application/ld+json">${JSON.stringify(faq)}</script>
</head>
<body>
  <a class="saltar" href="#contenido">Ir al contenido</a>
  <header class="cabecera">
    <div class="envoltura">
      <a class="marca" href="/comunidades/"><img src="/images/logo.png" alt="" width="32" height="32" />MeApunto</a>
      <a class="acceso" href="/">Acceso vecinos</a>
      <a class="boton boton-principal" href="${CONTACTO}">Pedir información</a>
    </div>
  </header>
  <main id="contenido">
    <div class="envoltura">
      <h1>${esc(p.h1)}</h1>
      <p class="entrada">${esc(p.p1)}</p>
      <div class="acciones">
        <a class="boton boton-principal" href="${CONTACTO}">Pedir información para mi comunidad</a>
        <a class="boton" href="/">Soy vecino: reservar</a>
      </div>
${p.cuerpo}
      <h2>Preguntas frecuentes</h2>
      <div class="preguntas">${p.preguntas.map(([q, a]) => `
        <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
      </div>
      <aside class="cierre" aria-label="Pedir información">
        <p><strong>¿Quieres MeApunto en tu urbanización?</strong> Escríbenos con el nombre de la comunidad y las pistas o salas que tenéis.</p>
        <p><a class="boton boton-principal" href="${CONTACTO}">Pedir información</a></p>
      </aside>
    </div>
  </main>
  <footer class="pie">
    <div class="envoltura">
      <p>MeApunto es un producto de ${TITULAR}.</p>
      <nav aria-label="Páginas">
        ${enlaces}
        <a href="/">Acceso vecinos</a>
        <a href="/privacy">Privacidad</a>
      </nav>
    </div>
  </footer>
</body>
</html>
`;
}

for (const p of PAGINAS) {
  const dir = `public${p.ruta}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}index.html`, pagina(p));
}
writeFileSync('public/web.css', CSS);
const hoy = new Date().toISOString().slice(0, 10);
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGINAS.map((p) => `  <url><loc>${WEB}${p.ruta}</loc><lastmod>${hoy}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync('public/robots.txt', `User-agent: *
Allow: /
Disallow: /admin
Disallow: /stats
Sitemap: ${WEB}/sitemap.xml
`);
// llms.txt: lo que leen ChatGPT, Claude y Perplexity para entender qué es MeApunto (GEO).
writeFileSync('public/llms.txt', `# MeApunto

> MeApunto es una app de reservas para comunidades de vecinos y urbanizaciones privadas en España. Cada vivienda reserva las pistas de pádel y tenis y las salas de la urbanización desde el móvil, en meapunto.online, y todos los vecinos ven las reservas.

- Alta de los vecinos: cada vivienda recibe una carta con su código único y crea su cuenta en meapunto.online. Una cuenta por vivienda.
- Reservas: el vecino elige día, pista y tiempo, ve sus próximas reservas y las de los demás, y puede anular las suyas.
- Normas de la comunidad dentro de la app.
- Panel para la administración: buscar viviendas, crear cuentas, cambiar el correo o la contraseña de un vecino y comprobar códigos.
- Cuota anual por comunidad, con una sola factura.
- La usan seis urbanizaciones, con unas 870 viviendas.
- Titular: ${TITULAR}. Contacto: meapunto.online@gmail.com

## Páginas

${PAGINAS.map((p) => `- [${p.h1}](${WEB}${p.ruta}): ${p.descripcion}`).join('\n')}
`);
console.log(`Páginas comerciales generadas: ${PAGINAS.map((p) => p.ruta).join(', ')} + sitemap.xml, robots.txt, llms.txt y web.css`);
