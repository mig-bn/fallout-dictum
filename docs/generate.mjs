// Genera la guía para jugadores a partir de los datos de los módulos:
//   node docs/generate.mjs
// Crea docs/guia-fallout-dictum.html y, con Chrome o Edge, docs/guia-fallout-dictum.pdf.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "v0.1 alfa";
const DOCS = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(DOCS);
const STARTER = join(ROOT, "fallout-dictum-starter", "data");

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const starter = file => readJson(join(STARTER, `${file}.json`));

const origins = starter("origins");
const factions = starter("factions");
const duties = starter("duties");
const roles = starter("roles");
const specialisations = starter("specialisations");
const skillTalents = starter("talents-skill");
const factionTalents = starter("talents-faction");
const weapons = starter("weapons");
const ammo = starter("ammo");
const protection = starter("protection");
const equipment = starter("equipment");
const { races } = readJson(join(ROOT, "fallout-dictum-races", "data", "items.json"));
const statSpecialisations = readJson(join(ROOT, "fallout-dictum-stats", "data", "specialisations.json"));

const wasteland = file => readJson(join(ROOT, "fallout-dictum-wasteland", "data", `${file}.json`));
const wWeapons = wasteland("weapons");
const wAmmo = wasteland("ammo");
const wArmour = wasteland("armour");
const wConsumables = wasteland("consumables");
const wEquipment = wasteland("equipment");
const wMods = wasteland("modifications");
const wAugmetics = wasteland("augmetics");
const wPerks = wasteland("perks");
const wCriticals = wasteland("criticals");
const wTables = wasteland("tables");

const CHARACTERISTICS = {
  str: "Strength (Fuerza)",
  per: "Perception (Percepción)",
  tgh: "Endurance (Resistencia)",
  fel: "Charisma (Carisma)",
  int: "Intelligence (Inteligencia)",
  ag: "Agility (Agilidad)",
  luck: "Luck (Suerte)"
};
const SHORT = { str: "Strength", per: "Perception", tgh: "Endurance", fel: "Charisma", int: "Intelligence", ag: "Agility", luck: "Luck" };

// Característica de cada skill: la del sistema, con los cambios de fallout-dictum-stats.
const SKILLS = {
  athletics: "str", awareness: "per", dexterity: "ag", discipline: "fel", fortitude: "tgh",
  intuition: "per", linguistics: "int", logic: "int", lore: "int", medicae: "int",
  melee: "str", navigation: "int", piloting: "ag", presence: "fel", ranged: "per",
  rapport: "fel", reflexes: "ag", stealth: "ag", tech: "int"
};
const skillName = key => key[0].toUpperCase() + key.slice(1);

const RANGES = { short: "Corto", medium: "Medio", long: "Largo", extreme: "Extremo", "": "—" };
const WEAPON_SPECS = { pistol: "Pistols", longGun: "Long Guns", ordnance: "Ordnance", thrown: "Thrown", oneHanded: "One-handed", twoHanded: "Two-handed", brawling: "Brawling" };
const TRAITS = { close: "Close", loud: "Loud", reliable: "Reliable", shoddy: "Shoddy", subtle: "Subtle", thrown: "Thrown", twohanded: "Two Handed" };
const LOCATIONS = { body: "Cuerpo", head: "Cabeza" };

const esc = text => String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const list = items => items.map(esc).join(", ");
const caps = value => (value || value === 0 ? `${value} Caps` : "—");

function table(headers, rows, className = "") {
  return `<table class="${className}"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
<tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("\n")}</tbody></table>`;
}

function choiceText({ structure, options }) {
  const name = id => esc(options.find(option => option.id === id)?.name);
  return (structure?.options ?? []).map(node => (node.type === "or" ? node.options.map(o => name(o.id)).join(" <em>o</em> ") : name(node.id))).join("; ") || "—";
}

const talentById = new Map([...skillTalents, ...factionTalents].map(talent => [talent._id, talent]));
const dutyById = new Map(duties.map(duty => [duty._id, duty]));
const stripP = html => html.replace(/<\/?p>/g, " ").trim();

function dutyLine(duty) {
  const { characteristics, skills, solars, notes } = duty.system.character;
  const stats = Object.keys(characteristics).map(key => `+${characteristics[key]} ${SHORT[key]}`).join(", ");
  const advances = Object.entries(skills).map(([key, value]) => `${skillName(key)} ${value}`).join(", ");
  return [`<strong>${esc(duty.name)}</strong><br><span class="small">${stripP(notes)}</span>`, stats, advances, caps(solars)];
}

const originSection = table(["Origen", "Fija (+5)", "A elegir (+5)", "Ítem", "Dónde naciste"], origins.map(origin => [
  `<strong>${esc(origin.name)}</strong>`,
  SHORT[origin.system.characteristics.base],
  origin.system.characteristics.choices.map(key => SHORT[key]).join(", "),
  origin.system.equipment.list.map(({ uuid }) => esc([...equipment, ...weapons, ...protection].find(item => uuid === `Item.${item._id}`)?.name)).join(", "),
  `<span class="small">${stripP(origin.system.notes.player)}</span>`
]));

const factionSection = factions.map(faction => {
  const c = faction.system.character;
  return `<section class="card">
<h3>${esc(faction.name)}</h3>
<p>${stripP(c.notes)}</p>
<dl>
<dt>Características</dt><dd>+5 a ${SHORT[c.characteristics.base]} y +5 a una entre ${c.characteristics.choices.map(key => SHORT[key]).join(", ")}</dd>
<dt>Avances</dt><dd>${c.advances.value} entre ${c.advances.skills.map(skillName).join(", ")}</dd>
<dt>Caps iniciales</dt><dd>${c.solars}</dd>
<dt>Influencia</dt><dd>1 en ${esc(faction.name)}</dd>
<dt>Perk</dt><dd>${esc(c.talents.options[0].name)}</dd>
<dt>Equipo</dt><dd>${choiceText(c.equipment)}</dd>
</dl>
${table(["Deber", "Características", "Avances", "Caps"], c.duty.list.map(({ id }) => dutyLine(dutyById.get(id))), "compact")}
</section>`;
}).join("\n");

const roleSection = roles.map(role => {
  const s = role.system;
  const talents = s.talents.list.map(({ uuid }) => talentById.get(uuid.replace("Item.", ""))?.name);
  return `<section class="card">
<h3>${esc(role.name)}</h3>
<p>${stripP(s.notes.player)}</p>
<dl>
<dt>Avances</dt><dd>${s.skills.value} entre ${s.skills.list.map(skillName).join(", ")}</dd>
<dt>Especializaciones</dt><dd>${s.specialisations.value}, de ${s.specialisations.keys.map(skillName).join(", ")}</dd>
<dt>Perks</dt><dd>Elige ${s.talents.number}: ${list(talents)}</dd>
<dt>Equipo</dt><dd>${choiceText(s.equipment)}</dd>
</dl>
</section>`;
}).join("\n");

const talentRows = talents => talents.map(talent => [`<strong>${esc(talent.name)}</strong>`, stripP(talent.system.notes.player)]);
const factionOfTalent = talent => factions.find(faction => faction.system.character.talents.options[0].documentId === talent._id)?.name;

const specsBySkill = {};
for (const { name, system } of specialisations) (specsBySkill[system.skill] ??= []).push(name);
for (const { name, skill } of statSpecialisations) (specsBySkill[skill] ??= []).push(name);

const weaponRow = weapon => {
  const s = weapon.system;
  const damage = s.damage.characteristic === "str" ? `Strength + ${s.damage.base}` : s.damage.base;
  const traits = s.traits.list.map(t => TRAITS[t.key] + (t.value ? ` (${t.value === "Short" ? "Corto" : t.value})` : ""));
  return [`<strong>${esc(weapon.name)}</strong>`, WEAPON_SPECS[s.spec], damage, RANGES[s.range], s.mag.value || "—", traits.join(", ") || "—", s.cost];
};
const weaponHeaders = ["Arma", "Especialización", "Daño", "Alcance", "Cargador", "Cualidades", "Caps"];

const traitName = ({ key, value }) => (TRAITS[key] ?? key[0].toUpperCase() + key.slice(1)) + (value ? ` (${value})` : "");
const wasteWeaponRow = weapon => {
  const s = weapon.system;
  const damage = s.damage.characteristic === "str" ? `Strength + ${s.damage.base}` : s.damage.base;
  return [`<strong>${esc(weapon.name)}</strong>`, WEAPON_SPECS[s.spec] ?? "—", damage, RANGES[s.range ?? ""] ?? "—", s.mag?.value || "—", s.traits.list.map(traitName).join(", ") || "—", s.cost];
};
// Una tabla por cada carpeta del compendio.
const byFolder = (items, render) => [...new Set(items.map(item => item.path.join(" / ")))]
  .map(path => `<h4>${esc(path)}</h4>\n${render(items.filter(item => item.path.join(" / ") === path))}`).join("\n");
const ZONE_NAMES = { head: "Cabeza", body: "Pecho", leftArm: "Brazo izq.", rightArm: "Brazo der.", leftLeg: "Pierna izq.", rightLeg: "Pierna der." };
const zones = item => item.system.locations.list.length === 6 ? "Todas" : item.system.locations.list.map(zone => ZONE_NAMES[zone]).join(", ") || "—";
const frame = wArmour.find(item => item.flags?.powerFrame);
const pieces = wArmour.filter(item => item.flags?.powerPiece);
const armourRows = wArmour.filter(item => item.system.category !== "power");
const powerModels = [...new Set(pieces.map(item => item.path.at(-1)))].map(model => {
  const set = pieces.filter(item => item.path.at(-1) === model);
  const zone = key => set.find(item => item.flags.powerPiece === key);
  const total = set.reduce((sum, item) => sum + item.system.cost, 0);
  return [`<strong>${esc(model)}</strong>`, `${zone("body").system.armour} / ${zone("head").system.armour} / ${zone("leftArm").system.armour}`, `${zone("body").flags.healthMax} / ${zone("head").flags.healthMax}`, `${zone("body").system.cost} / ${zone("head").system.cost}`, total];
});
const critText = item => stripP(item.system.notes.player.split("</p>")[0]);
const critSections = wTables.filter(t => t.key !== "fumble").map(t => `<h4>${esc(t.name.replace("Críticos de Fallout-Dictum: ", ""))}</h4>
${table(["Tirada", "Herida", "Efecto"], t.results.map(r => [r.range[0] === r.range[1] ? r.range[0] : r.range.join("-"), `<strong>${esc(r.name)}</strong>`, critText(wCriticals.find(c => r.documentUuid.endsWith(c._id)))]), "compact-text")}`).join("\n");

const body = `
<header class="cover">
  <p class="kicker">Guía para jugadores · ${VERSION}</p>
  <h1>Fallout-Dictum</h1>
  <p class="lede">Qué cambia en la hoja, cómo crear tu personaje y todo el contenido de los módulos de Fallout-Dictum para Imperium Maledictum en Foundry VTT.</p>
  <nav>
    <h2>Contenido</h2>
    <ol>
      <li><a href="#inicio">Antes de empezar</a></li>
      <li><a href="#hoja">Los cambios en la hoja</a></li>
      <li><a href="#creacion">Crear un personaje</a></li>
      <li><a href="#razas">Razas</a></li>
      <li><a href="#origenes">Orígenes</a></li>
      <li><a href="#facciones">Facciones y Deberes</a></li>
      <li><a href="#roles">Roles</a></li>
      <li><a href="#perks-base">Perks</a></li>
      <li><a href="#especializaciones">Especializaciones</a></li>
      <li><a href="#armas">Armas y munición</a></li>
      <li><a href="#armaduras">Armaduras</a></li>
      <li><a href="#equipo">Equipo</a></li>
      <li><a href="#wasteland">Wasteland: armas y armaduras</a></li>
      <li><a href="#servo">Wasteland: servoarmaduras</a></li>
      <li><a href="#consumibles">Wasteland: consumibles</a></li>
      <li><a href="#utilitarios">Wasteland: equipo y aumentos</a></li>
      <li><a href="#perks">Wasteland: Perks</a></li>
      <li><a href="#pifias">Wasteland: pifias y críticos</a></li>
      <li><a href="#foundry">Guía rápida en Foundry</a></li>
    </ol>
  </nav>
  <p class="small note">Proyecto de aficionados, sin afiliación con Cubicle 7, Games Workshop ni Bethesda. Esta guía documenta solo lo que añaden estos módulos: las reglas básicas siguen en el libro de Imperium Maledictum.</p>
</header>

<h2 id="inicio">1. Antes de empezar</h2>
<p>Fallout-Dictum adapta Imperium Maledictum al mundo de Fallout. Las tiradas, el combate, las esquivas y los parry funcionan como en el juego original. Cambian las características, algunas skills y el contenido con el que creas tu personaje.</p>
${table(["Módulo", "Qué aporta"], [
  ["<strong>Characteristics &amp; Skills</strong>", "Características, skills, Radiation y Caps"],
  ["<strong>Character Creation</strong>", "Etapa de Raza y tablas configurables"],
  ["<strong>Races</strong>", "Humano, Necrófago, Supermutante y Robot"],
  ["<strong>Starter</strong>", "Orígenes, Facciones, Roles, Perks y equipo"],
  ["<strong>Wasteland</strong>", "Más armas y armaduras, servoarmaduras por piezas, consumibles, Perks, pifias y críticos"]
])}
<p>En Foundry, muchos nombres siguen en inglés. Esta guía usa los mismos para que los encuentres en la hoja.</p>

<h2 id="hoja">2. Los cambios en la hoja</h2>
<h3>Características</h3>
${table(["Imperium Maledictum", "Fallout-Dictum"], [
  ["Weapon Skill", "Desaparece; lo que dependía de ella usa <strong>Strength</strong>"],
  ["Ballistic Skill", "Desaparece; lo que dependía de ella usa <strong>Perception</strong>"],
  ["Willpower", "Desaparece; lo que dependía de ella usa <strong>Charisma</strong>"],
  ["Toughness", "<strong>Endurance</strong>"],
  ["Fellowship", "<strong>Charisma</strong>"],
  ["—", "<strong>Luck</strong>: característica nueva"]
])}
<p>La hoja queda con las 7 características de S.P.E.C.I.A.L.: ${Object.values(SHORT).join(", ")}.</p>
<h3>Otros cambios</h3>
${table(["En la hoja", "Qué cambia"], [
  ["<strong>Radiation</strong>", "Sustituye a Corruption. Su máximo es igual a tus Wounds, y cada punto de Radiation reduce en 1 tus Wounds máximas."],
  ["<strong>Caps</strong>", "Sustituyen a los Solars. También se pueden editar desde la pestaña Notes."],
  ["<strong>Psychic</strong>", "Esta skill desaparece: no hay poderes psíquicos."],
  ["<strong>Handed</strong>", "Se añade Ambidextrous: ninguna de tus manos cuenta como mano torpe."]
])}
<h3>Skills y su característica</h3>
<p>Estas son las características de cada skill. Melee usa Strength; Ranged, Perception; y Discipline, Presence y Rapport, Charisma.</p>
${table(["Skill", "Característica", "Skill", "Característica"], (() => {
  const keys = Object.keys(SKILLS);
  const half = Math.ceil(keys.length / 2);
  return Array.from({ length: half }, (_, i) => [keys[i], keys[i + half]].flatMap(key => (key ? [skillName(key), SHORT[SKILLS[key]]] : ["", ""])));
})(), "compact")}

<h2 id="creacion">3. Crear un personaje</h2>
<p>Abre la barra de Actores y pulsa <strong>Character Creation</strong>. Completa las etapas en este orden:</p>
<ol class="steps">
  <li><strong>Raza.</strong> Tírala en la tabla, escribe una o arrastra su Ítem. Tirar da <strong>25 XP</strong>. Sin elegir, serás Humano.</li>
  <li><strong>Características.</strong> Tira 2d10 + 20 en las 7, salvo que tu Raza diga otra cosa. Tu decisión afecta a la XP:
    <ul>
      <li>Conservar la tirada tal cual: <strong>50 XP</strong>.</li>
      <li>Intercambiar valores entre características: <strong>25 XP</strong>.</li>
      <li>Repetir la tirada o repartir puntos: <strong>0 XP</strong>.</li>
    </ul>
    Si repartes, tienes <strong>70 puntos</strong>, con un mínimo de 4 y un máximo de 18 en cada una, y sumas el bono de la fórmula. Las Razas pueden bajar ese máximo y bloquear intercambios.</li>
  <li><strong>Origen.</strong> Dónde naciste. Tirar da <strong>25 XP</strong>; elegirlo, 0. Recibes +5 a una característica fija y +5 a una que elijas.</li>
  <li><strong>Facción.</strong> Tirar da <strong>75 XP</strong>; elegirla, 0. Recibes características, 5 avances, Caps, Influencia, Perk y equipo.</li>
  <li><strong>Rol.</strong> Arrastra su Ítem desde la barra de Ítems. Recibes 3 avances, 2 Especializaciones, Perks y equipo.</li>
  <li><strong>Detalles.</strong> Nombre, aspecto y objetivos.</li>
</ol>
<div class="callout"><strong>Límites al crear.</strong> Una skill no puede pasar de 2 avances entre todas las etapas, y no puedes repetir una Especialización.</div>

<h2 id="razas">4. Razas</h2>
${races.map(race => `<section class="card"><h3>${esc(race.name)}</h3>${race.notes}</section>`).join("\n")}

<h2 id="origenes">5. Orígenes</h2>
<p>Cada Origen da +5 a la característica fija, +5 a una elegida y un Ítem.</p>
${originSection}

<h2 id="facciones">6. Facciones y Deberes</h2>
<p>La Facción es a quién debes lealtad. Sus <strong>Deberes</strong> no se usan al crear un personaje: se eligen al arrastrar la Facción a un actor ya creado, lo que es útil para armar PNJ. Dan los valores indicados en cada tabla.</p>
${factionSection}

<h2 id="roles">7. Roles</h2>
<p>El Rol es lo que sabes hacer en el grupo.</p>
${roleSection}

<h2 id="perks-base">8. Perks</h2>
<p>Todos dan <strong>Ventaja</strong> en una skill, en la situación indicada. Al tirar esa skill, aparece como modificador en la ventana de la tirada. Actívalo tú solo si la situación se cumple.</p>
<h3>De Facción</h3>
${table(["Perk", "Facción", "Efecto"], factionTalents.map(talent => [`<strong>${esc(talent.name)}</strong>`, esc(factionOfTalent(talent)), stripP(talent.system.notes.player)]))}
<h3>De skill</h3>
<p>Cada Rol ofrece los Perks de sus 6 skills.</p>
${table(["Perk", "Efecto"], talentRows(skillTalents))}

<h2 id="especializaciones">9. Especializaciones</h2>
<p>Van en inglés porque el sistema busca algunas por su nombre exacto. Esta lista reúne las de Starter y Characteristics &amp; Skills. Si tu mesa usa otros módulos, puede haber más opciones.</p>
${table(["Skill", "Especializaciones"], Object.keys(specsBySkill).sort().map(key => [`<strong>${skillName(key)}</strong>`, list(specsBySkill[key])]))}

<h2 id="armas">10. Armas y munición</h2>
<h3>A distancia</h3>
${table(weaponHeaders, weapons.filter(w => w.system.attackType === "ranged").map(weaponRow))}
<h3>Cuerpo a cuerpo</h3>
${table(weaponHeaders, weapons.filter(w => w.system.attackType === "melee").map(weaponRow))}
<h3>Cualidades</h3>
${table(["Cualidad", "Efecto"], [
  ["<strong>Shoddy</strong>", "Resta 1 SL a tus tiradas con el arma."],
  ["<strong>Thrown</strong>", "El arma se puede lanzar, al alcance indicado."],
  ["<strong>Two Handed</strong>", "El arma ocupa las dos manos."],
  ["<strong>Close, Loud, Reliable, Subtle</strong>", "Son cualidades del juego original: consulta su efecto en el libro de Imperium Maledictum."]
])}
<h3>Munición</h3>
${table(["Munición", "Cantidad", "Caps", "Para"], ammo.map(item => [`<strong>${esc(item.name)}</strong>`, item.system.quantity, item.system.cost, esc(item.system.usedWith)]))}
<div class="callout"><strong>Importante.</strong> Selecciona la munición en la hoja de cada arma. El arma empieza con el cargador lleno y puede disparar, pero no se recargará si no tiene munición seleccionada. La lista muestra toda tu munición, así que elige la correcta.</div>

<h2 id="armaduras">11. Armaduras</h2>
${table(["Armadura", "Protección", "Zona", "Carga", "Caps"], protection.map(item => [`<strong>${esc(item.name)}</strong>`, item.system.armour, item.system.locations.list.map(l => LOCATIONS[l]).join(", "), item.system.encumbrance.value, item.system.cost]))}
<p>Equípala en la hoja para que su protección cuente. La Protección reduce el daño recibido en esa zona.</p>

<h2 id="equipo">12. Equipo</h2>
${table(["Objeto", "Descripción", "Carga", "Caps"], equipment.map(item => [`<strong>${esc(item.name)}</strong>`, stripP(item.system.notes.player).replace(/ Para crear otro.*$/, ""), item.system.encumbrance?.value ?? 0, item.system.cost]))}
<div class="callout"><strong>Stimpak y drogas.</strong> Un Stimpak cura 1d10 Heridas. Los Necrófagos solo reciben la mitad de esa curación, y los Robots no reciben efecto de estimulantes ni drogas.</div>

<h2 id="wasteland">13. Wasteland: armas y armaduras</h2>
<p>El contenido de Wasteland está en sus compendios de Foundry. No repite lo anterior, salvo algunas piezas para completar conjuntos.</p>
<h3>Armas</h3>
${byFolder(wWeapons, items => table(weaponHeaders, items.map(wasteWeaponRow), "compact-text"))}
<h3>Munición</h3>
${table(["Munición", "Cantidad", "Caps", "Para"], wAmmo.filter(item => item.type === "ammo").map(item => [`<strong>${esc(item.name)}</strong>`, item.system.quantity, item.system.cost, esc(item.system.usedWith)]))}
<h3>Armaduras</h3>
<p>El sistema suma la Protección de todo lo que lleves equipado en una zona. Como regla de mesa, solo la Ropa de Yermo se combina con piezas.</p>
${byFolder(armourRows, items => table(["Armadura", "Protección", "Zona", "Carga", "Cualidades", "Caps"], items.map(item => [`<strong>${esc(item.name)}</strong>`, item.system.armour || "—", zones(item), item.system.encumbrance.value, item.system.traits.list.map(traitName).join(", ") || "—", item.system.cost]), "compact-text"))}

<h2 id="servo">14. Wasteland: servoarmaduras</h2>
<p>Una servoarmadura se monta sobre un <strong>Armazón de servoarmadura</strong> (${frame.system.cost} Caps) con 6 piezas: casco, pecho y cada brazo y pierna. Cada pieza se compra aparte, y se pueden mezclar modelos.</p>
<ol class="steps">
  <li>Ten en tu inventario el Armazón de servoarmadura, las piezas y un Núcleo de fusión.</li>
  <li>Abre la hoja del Armazón de servoarmadura desde su Ítem o desde su fila en el personaje.</li>
  <li>Arrastra allí las piezas: cada una va a su zona. Instala el núcleo.</li>
  <li>Equipa el Armazón de servoarmadura: heredas las piezas que tenga puestas.</li>
</ol>
${table(["Con cargas", "Efecto"], [
  ["<strong>Strength</strong>", "Se reemplaza por 55, tengas más o menos."],
  ["<strong>Carga</strong>", "El Armazón de servoarmadura y sus piezas no cuentan."],
  ["<strong>Radiación</strong>", "Con las 6 piezas intactas, eres inmune a la Radiation de los impactos."]
])}
${table(["Siempre", "Efecto"], [
  ["<strong>Daño</strong>", "El Armour de la pieza reduce el golpe y lo que queda baja su vida. Si se rompe, el daño restante pasa a tus Wounds. Rota no da Armour hasta repararla."],
  ["<strong>Tosca y ruidosa</strong>", "Desventaja en toda tirada de Agility, y además por Loud en Stealth."],
  ["<strong>Otras armaduras</strong>", "Solo puedes llevar armadura Subtle."],
  ["<strong>Energía</strong>", "Un Núcleo de fusión da 30 cargas, y gastas 1 al terminar cada uno de tus turnos de combate. Sin cargas pierdes Strength 55, carga 0 e inmunidad."],
  ["<strong>Reparar</strong>", "La vida se sube a mano en la hoja al repararla. Los Stimpaks no curan piezas."],
  ["<strong>Caídas</strong>", "Sin daño a cualquier altura. Desde más de un piso, quienes estén a tu alcance reciben 5 Damage."]
])}
<h3>Modelos</h3>
<p>Los valores de Armour son de pecho, casco y extremidades. La vida y el precio de cada extremidad son iguales a los del casco.</p>
${table(["Modelo", "Armour", "Vida (pecho / resto)", "Caps (pecho / resto)", "Caps del conjunto"], powerModels)}

<h2 id="consumibles">15. Wasteland: consumibles</h2>
<p>Se usan desde la hoja. Los efectos que duran una escena quedan en el personaje: retíralos cuando termine.</p>
${byFolder(wConsumables, items => table(["Consumible", "Efecto", "Caps"], items.map(item => [`<strong>${esc(item.name)}</strong>`, stripP(item.system.notes.player), item.system.cost])))}

<h2 id="utilitarios">16. Wasteland: equipo y aumentos</h2>
<h3>Equipo</h3>
<p>La mayoría no tiene reglas automáticas: te permite hacer algo o da Ventaja si el máster lo acepta.</p>
${byFolder(wEquipment, items => table(["Objeto", "Para qué sirve", "Carga", "Caps"], items.map(item => [`<strong>${esc(item.name)}</strong>`, stripP(item.system.notes.player), item.system.encumbrance.value, item.system.cost])))}
<h3>Modificaciones</h3>
<p>Arrastra la modificación a la hoja de tu arma, armadura, escudo o pieza de servoarmadura: sale del inventario y vuelve al quitarla. Hay una por ranura, y cada Ítem solo admite las que le encajan. Desde la hoja también puedes desactivarlas.</p>
${byFolder(wMods, items => table(["Modificación", "Efecto", "Se usa con", "Caps"], items.map(item => [`<strong>${esc(item.name)}</strong>`, stripP(item.system.notes.player), esc(item.system.usedWith), item.system.cost])))}
<h3>Aumentos</h3>
<p>Equípalos en la hoja para que cuenten. Cada uno ocupa 1, y tu máximo depende de tu bono de Endurance.</p>
${byFolder(wAugmetics, items => table(["Aumento", "Efecto", "Caps"], items.map(item => [`<strong>${esc(item.name)}</strong>`, stripP(item.system.notes.player), item.system.cost])))}

<h2 id="perks">17. Wasteland: Perks</h2>
<p>Cuestan 100 XP. Si no cumples el requisito, el sistema pregunta si quieres ignorarlo.</p>
${byFolder(wPerks, items => table(["Perk", "Efecto", "Requisito"], items.map(item => [`<strong>${esc(item.name)}</strong>`, stripP(item.system.notes.player), esc(item.system.requirement.value) || "Ninguno"])))}

<h2 id="pifias">18. Wasteland: pifias y críticos</h2>
<h3>Pifias (1d10)</h3>
${table(["Tirada", "Pifia", "Efecto"], wTables.find(t => t.key === "fumble").results.map(r => [r.range[0], `<strong>${esc(r.name)}</strong>`, stripP(r.description)]))}
<h3>Críticos (1d10 + daño sobrante)</h3>
<p>La herida aparece en el chat: arrástrala a tu personaje. Sus condiciones se aplican solas, y al curarla debes quitarlas aparte. Se trata con Medicae, según indica su Ítem.</p>
${critSections}

<h2 id="foundry">19. Guía rápida en Foundry</h2>
<ol class="steps">
  <li><strong>Crea tu personaje</strong> con el botón Character Creation. Debe haber un máster conectado para que se pueda crear.</li>
  <li><strong>Equipa</strong> armas y armaduras desde la hoja.</li>
  <li><strong>Selecciona la munición</strong> de cada arma de fuego.</li>
  <li><strong>Al tirar</strong>, revisa los modificadores de la ventana y activa tus Perks si aplican.</li>
  <li><strong>Al atacar</strong>, apunta al objetivo con <strong>T</strong> sobre su token y ataca desde la hoja.</li>
  <li><strong>Usa un consumible</strong>, como el Stimpak, desde tu hoja.</li>
  <li><strong>Compra Perks</strong> arrastrándolos desde el compendio de Wasteland a tu personaje.</li>
</ol>
<p class="small note">${VERSION} · Generado a partir de los datos de los módulos.</p>
`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Fallout-Dictum: Guía para jugadores</title>
<style>
@page { size: A4; margin: 18mm 16mm 18mm; @bottom-center { content: "Fallout-Dictum · ${VERSION} · " counter(page); font: 8.5pt "Segoe UI", Arial, sans-serif; color: #6b6655; } }
* { box-sizing: border-box; }
:root { --ink: #24231e; --muted: #6b6655; --accent: #245a4b; --warm: #a8611c; --rule: #cfc8b4; --tint: #f3efe3; }
body { margin: 0; color: var(--ink); font: 10pt/1.42 "Segoe UI", Arial, sans-serif; background: #fff; }
h1, h2, h3 { font-family: Bahnschrift, "Segoe UI", Arial, sans-serif; line-height: 1.15; }
h1 { font-size: 46pt; margin: 4mm 0; color: var(--accent); }
h2 { font-size: 19pt; color: var(--accent); margin: 0 0 3mm; padding-bottom: 1.5mm; border-bottom: 2px solid var(--accent); break-before: page; break-after: avoid; }
h3 { font-size: 12.5pt; margin: 4mm 0 1.5mm; color: var(--warm); break-after: avoid; }
h4 { font-size: 10pt; margin: 3mm 0 1mm; break-after: avoid; }
table.compact-text { font-size: 8.6pt; }
p { margin: 0 0 2.5mm; }
a { color: inherit; text-decoration: none; }
.cover .kicker { margin-top: 20mm; color: var(--warm); font-family: Bahnschrift, Arial, sans-serif; font-size: 12pt; letter-spacing: .04em; }
.cover .lede { font-size: 13pt; max-width: 150mm; }
.cover nav { margin: 10mm 0; padding: 5mm 7mm; background: var(--tint); }
.cover nav h2 { font-size: 13pt; border: 0; margin: 0 0 2mm; padding: 0; break-before: auto; }
.cover nav ol { columns: 2; margin: 0; padding-left: 6mm; }
.small { font-size: 8.8pt; }
.note { color: var(--muted); }
table { width: 100%; border-collapse: collapse; margin: 1.5mm 0 4mm; font-size: 9.2pt; }
thead { display: table-header-group; }
th { text-align: left; background: var(--accent); color: #fff; padding: 1.3mm 2mm; font-weight: 600; }
td { padding: 1.3mm 2mm; border-bottom: 1px solid var(--rule); vertical-align: top; }
table.compact td:last-child { white-space: nowrap; }
tr { break-inside: avoid; }
table.compact { font-size: 8.6pt; margin-bottom: 0; }
table.compact th { background: var(--tint); color: var(--ink); }
.card { break-inside: avoid; padding: 2.5mm 0 3.5mm; border-bottom: 1px solid var(--rule); }
.card h3 { margin-top: 0; }
.card:last-child { border-bottom: 0; }
.card p:last-child, .card ul:last-child { margin-bottom: 0; }
.card ul { margin: 0 0 2mm; padding-left: 5mm; }
dl { display: grid; grid-template-columns: 31mm 1fr; gap: .7mm 3mm; margin: 0 0 2.5mm; font-size: 9.4pt; }
dt { font-weight: 600; }
dd { margin: 0; }
.steps { padding-left: 6mm; margin: 0 0 3mm; }
.steps li { margin-bottom: 1.8mm; }
.steps ul { margin: 1mm 0; padding-left: 5mm; }
.callout { background: var(--tint); border-left: 3px solid var(--warm); padding: 2.5mm 3.5mm; margin: 2mm 0 4mm; break-inside: avoid; }
</style>
</head>
<body>${body}</body>
</html>
`;

const htmlPath = join(DOCS, "guia-fallout-dictum.html");
const pdfPath = join(DOCS, "guia-fallout-dictum.pdf");
writeFileSync(htmlPath, html);

const browser = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
].find(existsSync);
if (!browser) throw new Error("No se encontró Chrome ni Edge para generar el PDF.");

execFileSync(browser, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${pdfPath}`, htmlPath], { stdio: "ignore" });
console.log(`PDF generado: ${pdfPath}`);
