# Fallout: The Roleplaying Game (Modiphius, 2d20)

Consultado el 2026-10-31. Se revisaron las reglas básicas gratuitas de Roll20 y fuentes secundarias, no el libro completo.

Niveles de confianza:

- **Reglas:** aparece en las reglas básicas de Roll20.
- **Secundaria:** viene de una reseña, un listado o un extracto de buscador.
- **Fan:** material no oficial.
- **Sin confirmar:** no se encontró; eso no prueba que no exista.

## Radiación

| Dato | Confianza | Fuente |
|---|---|---|
| Cada punto, tras restar la resistencia a radiación, baja los PV máximos y no los actuales. | Reglas | [Healing](https://roll20.net/compendium/fallout/Healing) |
| Solo se elimina con RadAway u otros consumibles que quiten radiación. | Reglas | [Healing](https://roll20.net/compendium/fallout/Healing) |
| Si se curan PV y radiación a la vez, primero se quita la radiación. | Reglas | [Healing](https://roll20.net/compendium/fallout/Healing) |
| RadAway quita 4 de radiación y cuesta 80 Caps. | Reglas | [RadAway](https://roll20.net/compendium/fallout/RadAway) |
| El efecto Radioactive se resuelve igual que el daño directo por radiación. | Secundaria | [Foro de Modiphius](https://forums.modiphius.com/t/radioactive-and-radiation/15321) (extracto; el hilo pide cuenta) |
| Las armaduras tienen resistencias separadas: física, energía y radiación. | Secundaria | [Reseña](https://blackcampbell.substack.com/p/review-fallout-rpg) |

## Críticos y heridas

Fuente: [Damage and Injury](https://roll20.net/compendium/fallout/Rules:Damage%20and%20Injury). Confianza: Reglas.

Un impacto es crítico si hace 5 o más de daño tras restar la resistencia. Causa una herida según la zona, que dura hasta recibir atención médica:

| Zona | Efecto |
|---|---|
| Brazo | Suelta lo que lleva y no puede usar ese brazo. |
| Pierna | Cae al suelo, no puede esprintar y moverse pasa a ser una acción mayor. |
| Torso | Sangrado: daño físico cada turno que ignora la resistencia. |
| Cabeza | Aturdido el turno siguiente y peor en tiradas de vista. |

**Moribundo:** a 0 PV sufre una herida (dos si además fue crítico), cae inconsciente y cada turno un aliado debe hacer una tirada de supervivencia, cuya dificultad depende del número de heridas. Si falla, muere. Más daño añade más heridas.

## Pifias y complicaciones

| Dato | Confianza | Fuente |
|---|---|---|
| No hay tabla de pifias: un 20 en el dado genera una complicación. | Reglas | [Skill Tests](https://roll20.net/compendium/fallout/Skill%20Tests) |
| La complicación se aplica después de decidir el éxito, así que no impide tener éxito. | Secundaria | [Modiphius](https://modiphius.net/blogs/news/fallout-now-with-isocahedrons) |
| El máster amplía el rango según el riesgo: Normal 20, Risky 19-20, Perilous 18-20, Precarious 17-20, Treacherous 16-20. | Reglas | [Skill Tests](https://roll20.net/compendium/fallout/Skill%20Tests) |
| Un 1 en el dado es éxito crítico y vale dos éxitos. | Secundaria | [Modiphius](https://modiphius.net/blogs/news/fallout-now-with-isocahedrons) |

## Mutaciones

- **Sin confirmar:** no se encontró ninguna regla oficial que haga mutar a un personaje por radiación.
- **Fan:** existe una [tabla d20 francesa](https://fallout-jdr.fr/fichiers/aides/regles_alternatives/23-02-01-12-48-51_Fallout%202d20%20-%20Ajout%20et%20modifications%20de%20r%C3%A8gles%20by%20LT.pdf) en la que RadAway cancela la mutación activa.
- **Decisión:** por ahora no inventamos mutaciones. Ver [el plan](../plan-extensiones.md).

## Criaturas y PNJ

- **Reglas:** las reglas gratuitas incluyen perro, necrófago salvaje, cría de Mirelurk, Mister Gutsy, saqueador y réplica de sintético ([índice](https://roll20.net/compendium/fallout/BookIndex)).
- **Secundaria:** el libro incluye supermutantes, necrófagos y robots ([reseña](https://blackcampbell.substack.com/p/review-fallout-rpg)).
- **Sin confirmar:** la lista completa del bestiario y sus niveles de amenaza. Hace falta el libro oficial.

## Servoarmadura

Fuente: datos del [sistema de Fallout para Foundry](https://github.com/Muttley/foundryvtt-fallout) (commit `35260a1`), comunitario y con el consentimiento de Modiphius. Sus textos citan páginas del libro, pero no se comprobó en el libro. Confianza: Secundaria.

- **Fuerza:** con energía, usa STR 11 en lugar de la propia para todo: pruebas, carga y bono cuerpo a cuerpo.
- **Peso:** con energía, el armazón y sus piezas no cuentan para la carga.
- **Energía:** un núcleo tiene 10 cargas + Science y gasta 1 al final de cada escena. Las complicaciones de Athletics pueden gastar más, a juicio del máster.
- **Entrar o salir:** una acción mayor.
- **Caídas:** sin daño a cualquier altura, incluso sin energía. Desde más de un piso, hace 3 CD a quienes estén al alcance.
- **Entorno sellado:** con energía y todas las piezas intactas, permite respirar bajo el agua o entre gases tóxicos.
- **Piezas:** cada zona tiene su pieza, con vida y resistencias propias. La resistencia reduce el daño y el resto baja la vida de la pieza. Con 0 de vida o un impacto de 5+ daños, la pieza queda dañada y los golpes llegan al personaje.
- **Reparación:** como un robot, no con Stimpaks ni Medicine. Le afecta lo que daña a máquinas.
- **Mejoras:** Motion-Assist Servos sube STR a 13 y Calibrated Shocks da +50 de carga.

| Modelo | Vida del pecho | Vida de otras piezas | Pecho (física / energía / radiación) | Brazos y piernas | Casco |
|---|---|---|---|---|---|
| Saqueador | 10 | 7 | 8 / 6 / 9 | 4 / 3 / 7 | 6 / 4 / 7 |
| T-45 | 14 | 7 | 8 / 7 / 9 | 4 / 3 / 7 | 6 / 4 / 7 |
| T-51 | 18 | 9 | 8 / 7 / 9 | 5 / 4 / 7 | 6 / 5 / 7 |
| T-60 | 21 | 10 | 9 / 8 / 9 | 6 / 5 / 7 | 7 / 6 / 7 |
| X-01 | 24 | 12 | 10 / 8 / 9 | 7 / 6 / 7 | 8 / 7 / 7 |

## Otros sistemas del juego

| Dato | Confianza | Fuente |
|---|---|---|
| Hay reglas de hambre y sed, y estados asociados. | Secundaria | [Pantalla del máster](https://leisuregames.com/products/fallout-the-roleplaying-game-gm-screen-booklet-flysheet) |
| Hay tablas de botín. | Reglas | [Loot Tables](https://roll20.net/compendium/fallout/Loot%20Tables) |
| Existen reglas de adicción a drogas; el detalle está sin confirmar. | Secundaria | [Sistema de Foundry](https://www.foundryvtt-hub.com/package/fallout/) (compendio de adicciones) |

## Escala del contenido

El [sistema de Fallout para Foundry](https://www.foundryvtt-hub.com/package/fallout/) sirve para hacerse una idea del tamaño del juego completo, no como objetivo. No se usa su contenido.

| Compendio | Entradas |
|---|---|
| Perks | 190 |
| Armas | 68 |
| Modificaciones de arma | 145 |
| Ropa y armadura | 161 |
| Modificaciones de armadura | 161 |
| Consumibles | 137 |
| Munición | 20 |
| Adicciones | 12 |
| Módulos de robot | 13 |

## Armaduras de Fallout 4 (videojuego)

Fuente: [Fallout Wiki](https://fallout.wiki/wiki/Fallout_4_armor_and_clothing). Sirve de modelo para la estructura, no para los valores.

- **Piezas:** cada conjunto tiene pecho, brazo izquierdo, brazo derecho, pierna izquierda y pierna derecha.
- **Calidades:** estándar, resistente y pesada.
- **Con casco propio:** Combate y Sintética.
- **Sin casco en el conjunto:** Cuero, Metal y Saqueador.
- **Expansiones:** Marine tiene casco solo en su variante de asalto, Trapper no tiene casco y Robot tiene cascos solo en su versión básica.
- **X-02:** como nombre oficial aparece en contenido de Creation Club de Fallout 4. En Fallout 3 esa armadura es la Advanced Power Armor Mk II ([hilo de lore](https://teddit.bsalzberg.com/r/falloutlore/comments/9ug54f/fo76_spoiler_there_is_a_terminal_entry_that), no oficial).

## Modificaciones

- **Fallout RPG:** cada modificación ocupa una ranura (`modType` en el [sistema de Foundry](https://www.foundryvtt-hub.com/package/fallout/)): armazón, cañón, boca, cargador, mira, culata, empuñadura, condensador y, en cuerpo a cuerpo, filo. Cambian daño, cadencia, alcance, peso y cualidades, y añaden un prefijo al nombre del arma. Muchas piden un rango de Perk: Gun Nut, Blacksmith o Science!. Las armaduras tienen forros y materiales, como Lead Lined, Pocketed, Muffled o Padded.
- **New Vegas:** una modificación de cada tipo por arma, hasta 3, y [una vez puesta no se quita](https://fallout.wiki/wiki/Fallout:_New_Vegas_weapon_mods). Tipos: cargadores, miras, silenciadores, precisión, daño, cadencia, cañones, durabilidad y peso.
- **Fallout 4:** [ranuras por arma](https://fallout.wiki/wiki/Fallout_4_weapon_mods) (armazón, cañón, empuñadura o culata, cargador, mira y boca). Sus [modificaciones de armadura](https://primagames.com/eguides/fallout-4-eguide/inv/mods-charts/armor-mods) incluyen Lead Lined y Pocketed.
