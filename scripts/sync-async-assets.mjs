// Refresh the small subset of AsyncTI4 artwork and planet positions used here.
// Run from the repository root: node scripts/sync-async-assets.mjs
import fs from 'node:fs/promises';
import ts from 'typescript';

const upstream = 'https://raw.githubusercontent.com/AsyncTI4/TI4_map_generator_bot/master/';
const root = 'src/main/resources/';
const directory = 'src/assets/async';
await fs.mkdir(directory, { recursive: true });
const tilesSource = await fs.readFile('src/assets/data/tiles.ts', 'utf8');
const compiled = ts.transpileModule(tilesSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const tileExports = {};
new Function('exports', compiled)(tileExports);
const names = new Set(Object.values(tileExports.tilesInfo).flatMap(tile => tile.planets.map(planet => planet.name)));
const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const treeResponse = await fetch('https://api.github.com/repos/AsyncTI4/TI4_map_generator_bot/git/trees/master?recursive=1');
if (!treeResponse.ok) throw new Error(`Inventory: ${treeResponse.status}`);
const tree = (await treeResponse.json()).tree;
const planetPaths = tree.filter(entry => entry.path.startsWith(root + 'planets/') && entry.path.endsWith('.json'));
const byId = new Map(planetPaths.map(entry => [normalize(entry.path.split('/').pop().slice(0, -5)), entry.path]));
const jobs = [];
const metadata = {};
const unmatched = [];
const aliases = { 'Mecatol Rex': 'mr', Resulon: 'resculon', 'Mez Lo Orz Fei Zsha': 'mez', 'Rep Lo Orz Qet': 'rep', Paunus: 'faunus', 'New Terra': 'terra', Kosboth: 'kostboth', 'Luthien VI': 'luthieniv' };
for (const name of names) {
    const path = byId.get(normalize(aliases[name] ?? name));
    if (!path) { unmatched.push(name); continue; }
    jobs.push(async () => {
        const response = await fetch(upstream + path);
        if (!response.ok) throw new Error(`${path}: ${response.status}`);
        const planet = await response.json();
        metadata[name] = { id: planet.id, position: planet.positionInTile ?? planet.planetLayout?.centerPosition, type: planet.planetType, faction: planet.factionHomeworld };
    });
}
const assets = [];
assets.push(['extra/marker_damage.png', 'damage.png']);
for (let id = 1; id <= 8; id++) assets.push([`strat_cards/${id === 2 || id === 4 ? 'pok' : 'base_game'}_${id}.png`, `strategy-${id}.png`]);
for (const trait of ['cultural', 'industrial', 'hazardous', 'mr', 'none']) assets.push([`planet_cards/pc_attribute_${trait}.png`, `attribute-${trait}.png`]);
for (const icon of ['res', 'inf', 'legendary', 'tech_biotic', 'tech_warfare', 'tech_cybernetic', 'tech_propulsion']) {
    for (const status of ['rdy', 'exh']) assets.push([`planet_cards/pc_${icon}_${status}.png`, `${icon}-${status}.png`]);
}
for (const [source, target] of assets) jobs.push(async () => {
    const response = await fetch(upstream + root + source);
    if (!response.ok) throw new Error(`${source}: ${response.status}`);
    await fs.writeFile(`${directory}/${target}`, Buffer.from(await response.arrayBuffer()));
});
let cursor = 0;
await Promise.all(Array.from({ length: 6 }, async () => { while (cursor < jobs.length) await jobs[cursor++](); }));
await fs.writeFile('src/assets/data/async-planets.json', JSON.stringify(Object.fromEntries(Object.entries(metadata).sort()), null, 2) + '\n');
console.log(`Downloaded ${assets.length} images and ${Object.keys(metadata).length} planet positions. Unmatched planets: ${unmatched.join(', ') || 'none'}`);
