# Módulos para Imperium Maledictum (Foundry VTT)

Módulos de Foundry VTT para el sistema Imperium Maledictum (id `impmal`). Cada módulo es una carpeta en la raíz, con su propio repositorio git y un junction en `%LOCALAPPDATA%\FoundryVTT\Data\modules\<id>`, así que los cambios llegan directamente a Foundry.

## Estructura

- `referencia\`: copia del sistema (`impmal`) y de su módulo requerido (`warhammer-lib`). Sirve para consultar el código original; parte de la lógica de la hoja vive en `warhammer-lib`.
- `impmal-ajustes\`: ajustes independientes para el sistema original.
- `fallout-dictum-stats\`: primera extensión de Fallout-Dictum. Convierte características, skills, Radiation y Caps. Las siguientes fases (facciones, roles, orígenes, especies) van en extensiones propias.
- `fallout-dictum-chargen\`: creación de personaje configurable. Permite elegir las tablas de Orígenes, Facciones y Razas.
- `fallout-dictum-races\`: razas jugables (Humano, Necrófago, Supermutante y Robot) con sus tiradas y efectos.
- `fallout-dictum-starter\`: base de Fallout-Dictum. Requiere los módulos anteriores y añade lo mínimo para jugar: Facciones, Orígenes, Roles, Talentos e Ítems.

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
