// Generates stylized SVG scenery for each mock destination.
// Run once with `node tools/gen-images.mjs` before first build.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'destinations')
mkdirSync(outDir, { recursive: true })

const wrap = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${id.sky.top}"/>
      <stop offset="1" stop-color="${id.sky.bottom}"/>
    </linearGradient>
    ${id.water ? `<linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${id.water.top}"/>
      <stop offset="1" stop-color="${id.water.bottom}"/>
    </linearGradient>` : ''}
  </defs>
  <rect width="800" height="500" fill="url(#sky)"/>
  ${body}
</svg>
`

const sun = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`

const scenes = {
  mountain: (id) => wrap(id, `
${sun(400, 170, 72, id.sun)}
<circle cx="400" cy="170" r="88" fill="${id.sun}" opacity="0.22"/>
<polygon points="0,360 150,180 250,295 390,130 525,300 645,210 800,325 800,430 0,430" fill="${id.back}"/>
<polygon points="0,420 190,245 330,330 475,205 620,330 725,265 800,330 800,500 0,500" fill="${id.mid}"/>
<polyline points="158,214 174,186 190,218" fill="${id.snow}" stroke="${id.mid}" stroke-width="6"/>
<polyline points="370,144 396,106 438,162" fill="${id.snow}" stroke="${id.mid}" stroke-width="9"/>
<polyline points="472,214 490,181 510,216" fill="${id.snow}" stroke="${id.mid}" stroke-width="6"/>
<path d="M0 420 Q 200 395 400 408 T 800 400 L 800 500 L 0 500 Z" fill="url(#water)"/>
<path d="M250 446 Q 400 435 560 452" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.5"/>
`) ,
  beach: (id) => wrap(id, `
${sun(620, 150, 62, id.sun)}
<circle cx="620" cy="150" r="76" fill="${id.sun}" opacity="0.22"/>
<rect y="230" width="800" height="90" fill="url(#water)"/>
<path d="M0 300 Q 400 268 800 300 L 800 500 L 0 500 Z" fill="${id.sand}"/>
<path d="M120 470 C 118 430 128 390 158 362 L 148 356 C 118 382 106 420 108 470 Z" fill="${id.palmTrunk}"/>
<path d="M158 362 C 158 330 128 306 94 292 C 112 316 114 344 108 364 Z" fill="${id.palmLeaf}"/>
<path d="M158 362 C 166 336 200 318 236 316 C 212 334 196 352 192 368 Z" fill="${id.palmLeaf}"/>
<path d="M158 362 C 186 380 204 406 210 436 L 196 434 C 192 404 176 382 150 374 Z" fill="${id.palmLeafDark}"/>
<path d="M680 380 C 678 344 686 306 714 278 L 706 272 C 678 296 666 332 668 380 Z" fill="${id.palmTrunk}"/>
<path d="M714 278 C 710 250 688 226 660 214 C 680 236 682 262 678 280 Z" fill="${id.palmLeaf}"/>
<path d="M714 278 C 724 254 754 236 788 234 C 762 254 746 274 742 290 Z" fill="${id.palmLeaf}"/>
<path d="M436 300 C 430 320 430 360 436 380 Q 462 340 436 300 Z" fill="#ffffff" opacity="0.9"/>
<path d="M436 300 L 510 308 L 470 330 Z" fill="#ffffff" opacity="0.9"/>
`) ,
  city: (id) => wrap(id, `
${sun(580, 150, 64, id.sun)}
<circle cx="580" cy="150" r="80" fill="${id.sun}" opacity="0.2"/>
<rect x="0" y="300" width="800" height="200" fill="${id.back}"/>
<rect x="40" y="260" width="70" height="240" fill="${id.mid}"/>
<rect x="140" y="300" width="95" height="200" fill="${id.mid}"/>
<rect x="270" y="240" width="80" height="260" fill="${id.mid}"/>
<rect x="380" y="300" width="110" height="200" fill="${id.mid}"/>
<rect x="520" y="220" width="70" height="280" fill="${id.mid}"/>
<rect x="620" y="280" width="120" height="220" fill="${id.mid}"/>
<rect x="180" y="180" width="46" height="200" fill="${id.tower}" rx="3"/>
<path d="M203 126 l22 40 l-10 2 l0 18 l-24 0 l0 -18 l-10 -2 Z" fill="${id.towerRoof}"/>
<rect x="0" y="330" width="800" height="170" fill="${id.front}"/>
<rect x="60" y="300" width="90" height="200" fill="${id.front}" opacity="0.85"/>
<rect x="430" y="290" width="120" height="210" fill="${id.front}" opacity="0.85"/>
<rect x="680" y="300" width="90" height="200" fill="${id.front}" opacity="0.85"/>
<path d="M0 470 L 800 470 L 800 500 L 0 500 Z" fill="${id.water}"/>
<path d="M180 470 Q 200 452 220 470" stroke="none" fill="${id.water}" opacity="0.7"/>
`) ,
  forest: (id) => wrap(id, `
${sun(200, 140, 60, id.sun)}
<circle cx="200" cy="140" r="74" fill="${id.sun}" opacity="0.22"/>
<path d="M0 320 Q 200 250 400 300 T 800 280 L 800 400 L 0 400 Z" fill="${id.back}"/>
<path d="M0 400 Q 300 320 620 380 T 800 360 L 800 500 L 0 500 Z" fill="${id.mid}"/>
<path d="M0 470 Q 260 410 560 460 T 800 440 L 800 500 L 0 500 Z" fill="${id.pine}"/>
<path d="M110 470 Q 130 428 160 396 L 170 402 Q 150 438 138 470 Z" fill="${id.pine}" opacity="0.9"/>
<path d="M600 470 Q 610 440 626 424 L 632 428 Q 624 442 618 470 Z" fill="${id.pine}" opacity="0.9"/>
<path d="M60 260 Q 260 300 460 240 T 760 270 L 760 -20 L 60 -20 Z" fill="${id.mist}" opacity="0.5"/>
<path d="M0 430 Q 200 380 420 420 T 800 400 L 800 500 L 0 500 Z" fill="${id.river}"/>
`) ,
  coastal: (id) => wrap(id, `
${sun(420, 150, 66, id.sun)}
<circle cx="420" cy="150" r="80" fill="${id.sun}" opacity="0.22"/>
<rect y="330" width="800" height="170" fill="url(#water)"/>
<path d="M0 190 Q 240 240 420 330 L 0 360 Z" fill="${id.cliff}"/>
<path d="M230 160 Q 300 200 420 330 L 220 250 Z" fill="${id.cliffDark}"/>
<rect x="40" y="210" width="130" height="70" rx="4" fill="${id.wall}"/>
<rect x="50" y="225" width="30" height="26" rx="2" fill="#1e293b"/>
<rect x="92" y="225" width="30" height="26" rx="2" fill="#1e293b"/>
<path d="M105 206 q 14 10 28 4 q -12 8 -28 4 Z" fill="${id.dome}"/>
<rect x="196" y="238" width="100" height="46" rx="4" fill="${id.wall2}"/>
<rect x="206" y="250" width="26" height="20" rx="2" fill="#1e293b"/>
<path d="M246 232 q 13 9 26 4 q -11 7 -26 4 Z" fill="${id.dome2}"/>
<path d="M330 210 L 360 180 L 380 205 Z" fill="${id.cliffDark}"/>
<rect x="322" y="210" width="70" height="50" rx="4" fill="${id.wall}"/>
<path d="M357 206 q 12 8 24 4 q -10 6 -24 4 Z" fill="${id.dome}"/>
<path d="M560 190 Q 620 250 720 336 L 800 336 L 800 190 Z" fill="${id.cliff}"/>
<rect x="588" y="220" width="120" height="56" rx="4" fill="${id.wall3}"/>
<path d="M648 214 q 13 9 26 4 q -11 6 -26 4 Z" fill="${id.dome3}"/>
`) ,
}

function writeImage(name, scene, palette) {
  const svg = scenes[scene](palette)
  const file = join(outDir, `${name}.svg`)
  writeFileSync(file, svg, 'utf8')
  console.log(`Wrote ${file}`)
}

writeImage('santorini', 'coastal', {
  sky: { top: '#fb7185', bottom: '#fde68a' },
  sun: '#fff7ed',
  water: { top: '#0284c7', bottom: '#075985' },
  cliff: '#78350f', cliffDark: '#451a03',
  wall: '#fdf2f8', wall2: '#fef9c3', wall3: '#eff6ff',
  dome: '#1d4ed8', dome2: '#e11d48', dome3: '#1d4ed8',
})

writeImage('queenstown', 'mountain', {
  sky: { top: '#93c5fd', bottom: '#e0e7ff' },
  sun: '#fefce8',
  back: '#6366f1', mid: '#4338ca', snow: '#f5f3ff',
  water: { top: '#6366f1', bottom: '#312e81' },
})

writeImage('kyoto', 'city', {
  sky: { top: '#f9a8d4', bottom: '#fff7ed' },
  sun: '#fef2f2',
  back: '#a78bfa', mid: '#7c3aed', front: '#faf5ff',
  tower: '#b91c1c', towerRoof: '#7f1d1d',
  water: { top: '#c4b5fd', bottom: '#8b5cf6' },
})

writeImage('banff', 'mountain', {
  sky: { top: '#7dd3fc', bottom: '#ecfeff' },
  sun: '#f8fafc',
  back: '#64748b', mid: '#475569', snow: '#f8fafc',
  water: { top: '#2dd4bf', bottom: '#0f766e' },
})

writeImage('goa', 'beach', {
  sky: { top: '#fb923c', bottom: '#fde68a' },
  sun: '#fff7ed',
  water: { top: '#06b6d4', bottom: '#0e7490' },
  sand: '#fef3c7',
  palmTrunk: '#78350f', palmLeaf: '#15803d', palmLeafDark: '#166534',
})

writeImage('lisbon', 'city', {
  sky: { top: '#fb923c', bottom: '#fef08a' },
  sun: '#fffbeb',
  back: '#fde68a', mid: '#f59e0b', front: '#fcd34d',
  tower: '#dc2626', towerRoof: '#991b1b',
  water: { top: '#b45309', bottom: '#92400e' },
})

writeImage('rishikesh', 'forest', {
  sky: { top: '#fdba74', bottom: '#ffedd5' },
  sun: '#fff7ed',
  back: '#65a30d', mid: '#3f6212', pine: '#1a2e05',
  mist: '#fef3c7', river: { top: '#7dd3fc', bottom: '#0ea5e9' },
})

writeImage('amalfi', 'coastal', {
  sky: { top: '#a5f3fc', bottom: '#fef9c3' },
  sun: '#fefce8',
  water: { top: '#0ea5e9', bottom: '#1d4ed8' },
  cliff: '#fbbf24', cliffDark: '#b45309',
  wall: '#fecaca', wall2: '#bfdbfe', wall3: '#bbf7d0',
  dome: '#f59e0b', dome2: '#0ea5e9', dome3: '#22c55e',
})

writeImage('manali', 'forest', {
  sky: { top: '#c7d2fe', bottom: '#fbcfe8' },
  sun: '#fff1f2',
  back: '#166534', mid: '#14532d', pine: '#052e16',
  mist: '#e0e7ff', river: { top: '#67e8f9', bottom: '#06b6d4' },
})

writeImage('udaipur', 'city', {
  sky: { top: '#fca5a5', bottom: '#fef3c7' },
  sun: '#fff7ed',
  back: '#fb923c', mid: '#c2410c', front: '#fef3c7',
  tower: '#b91c1c', towerRoof: '#7f1d1d',
  water: { top: '#38bdf8', bottom: '#0369a1' },
})

writeImage('bali', 'beach', {
  sky: { top: '#5eead4', bottom: '#fef9c3' },
  sun: '#ffffff',
  water: { top: '#0ea5e9', bottom: '#1d4ed8' },
  sand: '#fef3c7',
  palmTrunk: '#78350f', palmLeaf: '#16a34a', palmLeafDark: '#15803d',
})

writeImage('istanbul', 'city', {
  sky: { top: '#93c5fd', bottom: '#fef9c3' },
  sun: '#fefce8',
  back: '#94a3b8', mid: '#334155', front: '#e2e8f0',
  tower: '#1d4ed8', towerRoof: '#1e3a8a',
  water: { top: '#38bdf8', bottom: '#0369a1' },
})

console.log('All destination images generated.')