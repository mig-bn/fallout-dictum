# Módulos para Imperium Maledictum (Foundry VTT)

Módulos de Foundry VTT para el sistema Imperium Maledictum (id `impmal`). Cada módulo es una carpeta en la raíz, con su propio repositorio git y un junction en `%LOCALAPPDATA%\FoundryVTT\Data\modules\<id>`, así que los cambios llegan directamente a Foundry.

## Estructura

- `referencia\`: copia del sistema (`impmal`) y de su módulo requerido (`warhammer-lib`). Sirve para consultar el código original; parte de la lógica de la hoja vive en `warhammer-lib`.
- `impmal-ajustes\`: ajustes independientes para el sistema original.
- `fallout-dictum-stats\`: primera extensión de Fallout-Dictum. Convierte características, skills, Radiation y Caps. Las siguientes fases (facciones, roles, orígenes, especies) van en extensiones propias.
- `fallout-dictum-chargen\`: creación de personaje configurable. Permite elegir las tablas de Orígenes, Facciones y Razas.
- `fallout-dictum-races\`: razas jugables (Humano, Necrófago, Supermutante y Robot) con sus tiradas y efectos.
- `fallout-dictum-starter\`: base de Fallout-Dictum. Requiere los módulos anteriores y añade lo mínimo para jugar: Facciones, Orígenes, Roles, Talentos e Ítems.
- `fallout-dictum-wasteland\`: amplía Fallout-Dictum con compendios de contenido. Se construye por categorías: armas, armaduras, consumibles, Perks y tablas.
- `docs\`: guía en PDF para jugadores, generada desde los datos de los módulos con `node docs/generate.mjs`. Hay que regenerarla al cambiar reglas o contenido.
- `docs\referencia\`: base de referencia sobre el juego de Fallout y el sistema. Consúltala antes de investigar una regla y añade ahí lo nuevo, con su fuente. El plan de las siguientes extensiones está en `docs\plan-extensiones.md`.

## Reglas de trabajo

- `referencia\` es de solo lectura: nunca se modifica.
- No se modifica nada del sistema original, ni en `referencia\` ni en `%LOCALAPPDATA%\FoundryVTT\Data\systems\impmal`. Tampoco se modifican los compendios de otros módulos.
- Todo cambio va en la carpeta del módulo al que pertenece.

### impmal-ajustes

- Cada ajuste va en su propio archivo dentro de `impmal-ajustes\scripts\fixes\`, con su propio setting on/off, y solo se activa si ese setting está encendido.
- Para añadir uno, crea `scripts\fixes\<id-del-ajuste>.js` con el formato descrito en `scripts\main.js`, impórtalo y añádelo a la lista `FIXES`. El setting se registra solo.

### fallout-dictum-stats

- Es una conversión: cada parte va en `scripts\features\`, pero se activan todas juntas y no tienen setting on/off.
- Las claves internas se conservan: Endurance es `tgh`, Charisma es `fel`, Agility es `ag`, Radiation es `corruption` y Caps es `solars`.
- `ws`, `bs` y `wil` ya no existen en los datos, pero siguen como alias no enumerables de `str`, `per` y `fel` (`scripts\aliases.js`), porque el sistema y los compendios los piden. `psychic` es igualmente alias de `discipline`.
- No es compatible con el ajuste de Suerte de `impmal-ajustes`.

### fallout-dictum-chargen

- Amplía la creación de personaje del sistema desde el hook `impmal:chargen`, sin reemplazarla: las tablas vacías mantienen el comportamiento original.
- Los resultados de Orígenes y Facciones deben enlazar un Ítem de ese tipo. Los de Razas pueden ser texto o cualquier Ítem salvo `origin`, `faction` y `role`.
- La raza se guarda en `system.details.species`; si tiene un Ítem, este se añade al personaje.
- La etapa de Raza va antes de Características. Por defecto es Humano y solo se rolea si está activo `fallout-dictum-races`.

### fallout-dictum-races

- Requiere `fallout-dictum-stats` y `fallout-dictum-chargen`.
- Cada raza es un Talento sin coste de XP. Sus reglas de creación van en sus flags y sus inmunidades, en efectos con scripts `preUpdateDocument`.
- Los Ítems y la tabla de Razas se crean una sola vez por mundo desde `data\items.json`; después son editables en Foundry. Si cambian las reglas, se sube `RULES_VERSION` en `scripts\seed.js`: las razas del mundo se reescriben una vez, sin tocar a los personajes existentes.
- Las características penalizadas (`1d10 + 15`) no se pueden intercambiar en la creación.
- Los consumibles se reconocen por el flag `kind` (`stimulant` o `drug`), y los estimulantes curan según el flag `healing`. El Stimpak se crea en `fallout-dictum-starter`, con esos flags.

### fallout-dictum-starter

- Es la entrada de Fallout-Dictum: requiere `fallout-dictum-stats`, `fallout-dictum-chargen` y `fallout-dictum-races`, y las extensiones futuras deben requerirlo a él. Esos tres no lo requieren, para evitar una dependencia circular.
- Contenido mínimo; lo demás lo añade el máster o sus extensiones. Facciones: Minutemen, Hermandad del Acero, Ferrocarril, Instituto, Saqueadores, Caravaneros y Trotamundos. Orígenes: dónde nació el personaje. Roles: los 6 del juego base y Assassin y Seeker de `impmal-inquisition`, adaptados y sin poderes psíquicos.
- Orígenes, Facciones y Roles siguen la estructura del libro base (`impmal-core`), pero no se copian sus textos.
- Los Talentos e Ítems se añaden según los pidan las Facciones, Orígenes y Roles, incluidas Especializaciones y Deberes.
- Cada skill tiene un Talento, y cada Rol ofrece los de sus 6 skills. Cada Facción tiene su Talento exclusivo, para que no se obtenga dos veces. Dan Ventaja mediante un modificador `dialog` que el jugador activa, oculto en las demás skills.
- Reemplaza `game.impmal.config.factions` en el hook `setup`.
- Cada archivo de `data\` es una categoría, con su carpeta en Foundry (la lista `CATEGORIES` de `scripts\seed.js`). Los Ítems ya creados no cambian de carpeta.
- Los Ítems se crean desde `data\` una sola vez por mundo y por `key`, conservando su `_id` porque se enlazan entre sí: el contenido nuevo llega a mundos existentes, pero lo que el máster edite o borre no se restaura.
- Un Talento no debe poder obtenerse dos veces en la creación (por ejemplo, en la Facción y en el Rol): el duplicado queda como XP gastada (100).
- Las extensiones de Fallout-Dictum no requieren `impmal-core` ni enlazan su contenido. Es opcional: sin él, las tablas e Ítems que falten (como los críticos) los aporta el máster, ya sean propios o de un módulo que tenga.
- También crea una tabla de Orígenes y otra de Facciones, y las asigna en `fallout-dictum-chargen` solo si esa fila está vacía. Una vez creadas, añadir Orígenes o Facciones a `data\` no las actualiza.
- Las Especializaciones van en inglés y con los nombres del sistema, que busca algunas por su nombre exacto (como `Dodge` o `Hide`). `scripts\weapons.js` hace que las armas las encuentren aunque Foundry esté en otro idioma.
- El sistema no recarga un arma sin un Ítem de munición seleccionado en ella. Cada Facción entrega la munición de su arma, y el jugador la selecciona en la hoja.
- Cada Facción tiene 3 Deberes. La creación de personaje no los usa: solo se eligen al arrastrar una Facción a un actor ya creado.
- Se construye por fases: base, prueba de personaje completo, Facciones, Orígenes, Roles, Talentos e Ítems, y cierre.

### fallout-dictum-wasteland

- Requiere `fallout-dictum-starter`. No repite sus Ítems ni requiere `impmal-core`. La excepción son los petos de cuero, chatarra y combate y el Casco de combate reforzado, para que cada conjunto esté completo en su carpeta.
- El sistema suma el Armour de todo lo equipado en una zona. Fuera de las servoarmaduras, solo la Ropa de Yermo se combina con piezas; es una regla de mesa, no se bloquea por código.
- Antes de crear una categoría, se presenta su lista y se espera la aprobación.
- Las estadísticas siguen los patrones de `docs\referencia\impmal-sistema.md`, pero nombres, valores y textos son propios.
- Una servoarmadura es un ServoEsqueleto con 6 piezas (`scripts\power-armour.js`), que se montan en sus ranuras (`system.slots`) desde su hoja. Una pieza montada queda equipada solo mientras lo esté el ServoEsqueleto. Se identifican por los flags `powerFrame` y `powerPiece` (su zona), y cada pieza guarda `health` y `healthMax`.
- Con cargas (flag `charges`), el ServoEsqueleto equipado reemplaza Strength por 55, tenga el personaje más o menos, y él y sus piezas no cuentan para la carga. Gasta 1 carga al terminar cada turno de combate. Un Núcleo de fusión da 30, y sin cargas se pierde lo anterior, pero no el Armour.
- El Armour de la pieza reduce el daño, lo que queda baja su vida y, si se rompe, el resto pasa a las Wounds. Rota no da Armour; al subirle la vida en la hoja lo recupera.
- El ServoEsqueleto da Desventaja en toda tirada de Agility y lleva `loud`. Solo admite armadura `subtle`, y esto sí se bloquea por código, igual que equipar una pieza suelta o colocarla en otra zona.
- Con cargas y las 6 piezas intactas está sellado: es inmune a la Radiation de los impactos y muestra el estado "Resistente a la radiación". Las caídas y el entorno sellado son reglas de sus notas, que resuelve el máster.
- Los consumibles usan el flag `kind` de `fallout-dictum-races` (en `data\` es el campo `rules`), para que siga curando y respetando las inmunidades de cada raza. `scripts\consumables.js` añade los flags `removeRadiation`, `addRadiation`, `noCombat` y `scene`. Este último crea un efecto en el personaje, que se retira a mano al terminar la escena; repetir la dosis lo reemplaza.
- Los Perks son Talentos de 100 XP construidos como los de `impmal-core`: requisitos por Avances con `requirement.script`, y efectos situacionales mejor que bonos fijos. El sistema pregunta si se ignora un requisito no cumplido. El flag `perk` identifica los que se comprueban desde código.
- Las tablas de pifias y críticos se crean en cada mundo desde `data\tables.json`, una vez por `key` (`scripts\tables.js`), porque el ajuste del sistema solo acepta tablas del mundo. Se asignan si la fila está vacía, apunta a una tabla inexistente o conserva el valor original. Los críticos son Ítems del compendio `criticals`, y sus condiciones se aplican con scripts `immediate`.
- El contenido se edita en `data\` y se genera con `npm run build`, con Foundry cerrado. Cada archivo es un compendio de `packs\`, y `path` indica su carpeta. El `_id` no se cambia.
- Las mutaciones están desactivadas: fallar al sucumbir quita Radiation, pero no tira ninguna tabla (`scripts\mutations.js`).
- El flag `radiation` de un arma o proyectil suma esa Radiation a cada impacto contra un personaje, ignorando la armadura. Las inmunidades de las razas siguen actuando. El flag `radiationResistance` de una armadura equipada la reduce.
