// Auditoría de accesibilidad (WCAG 2.2 A/AA) sobre el HTML renderizado, con
// axe-core corriendo DENTRO de jsdom. Captura criterios estructurales (labels,
// alt, roles, aria, landmarks, jerarquía de encabezados, nombres accesibles,
// lang, etc.). El contraste de color se revisa aparte (jsdom no computa layout).
//
// Uso:  BASE=http://localhost:3190 node scripts/probar-a11y.mjs
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('=') && !l.trimStart().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const BASE = process.env.BASE || 'http://localhost:3190';
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const tp = (await db.from('tramites').select('slug').eq('estado', 'publicado').limit(1)).data?.[0]?.slug;
const dp = (await db.from('dependencias').select('slug').eq('estado', 'publicado').limit(1)).data?.[0]?.slug;

const paginas = [
  ['/', 'Home'],
  ['/tramites', 'Índice trámites'],
  ['/dependencias', 'Índice dependencias'],
  ['/directorio', 'Directorio'],
  ['/guias', 'Índice guías'],
  ['/privacidad', 'Aviso de privacidad'],
  ['/admin/login', 'Admin login'],
  ...(tp ? [[`/tramites/${tp}`, 'Ficha de trámite']] : []),
  ...(dp ? [[`/dependencias/${dp}`, 'Ficha de dependencia']] : []),
];

const NO_FIABLES = new Set(['color-contrast', 'target-size', 'scrollable-region-focusable']);

let totalViol = 0;
for (const [ruta, nombre] of paginas) {
  let html;
  try { html = await (await fetch(BASE + ruta)).text(); }
  catch (e) { console.log(`\n### ${nombre} (${ruta}) — no se pudo cargar: ${e.message}`); continue; }

  const dom = new JSDOM(html, { url: BASE + ruta, pretendToBeVisual: true, runScripts: 'outside-only' });
  dom.window.eval(axeSource);
  const res = await dom.window.axe.run(dom.window.document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    resultTypes: ['violations'],
  });

  const viol = res.violations.filter((v) => !NO_FIABLES.has(v.id));
  console.log(`\n### ${nombre} (${ruta}) — ${viol.length ? viol.length + ' tipo(s)' : 'sin violaciones estructurales ✓'}`);
  for (const v of viol) {
    totalViol += v.nodes.length;
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
    for (const n of v.nodes.slice(0, 4)) console.log(`     · ${n.target.join(' ')}  ${n.html.slice(0, 100).replace(/\s+/g, ' ')}`);
  }
  dom.window.close();
}

console.log(`\n=== total de nodos con violación (excl. reglas dependientes de layout): ${totalViol} ===`);
process.exit(totalViol ? 1 : 0);
