# Sistema Imperium Maledictum e `impmal-core`

Comprobado leyendo `referencia\impmal\impmal.js` (`impmal` 4.1.0) y los packs de `impmal-core`, sin ejecutar en Foundry. Los números de línea son de ese archivo.

## Tablas

- **Ajuste:** `game.settings.get("impmal", "tableSettings")` guarda el id de una tabla del mundo por cada clave. Su valor inicial son los ids de `impmal-core` (línea 11558).
- **Claves:** `critarm`, `critleg`, `crithead`, `critbody`, `critwheeled`, `critwalker`, `critflyer`, `crittracked`, `critvehicle`, `fumble`, `perils`, `phenomena`, `talents`, `origin`, `mutation` y `malignancy`.
- **Sin tabla ni fórmula:** `rollTable` muestra un error y lanza una excepción (línea 821).
- **Sin tabla, con fórmula:** avisa del error y muestra solo la tirada (línea 856).
- **Tope:** si la tirada supera el rango de la tabla, se usa el resultado más alto (línea 870).
- **Resultado:** si enlaza un documento, publica ese Ítem en el chat; si no, muestra el texto (línea 876).

## Críticos y pifias

- **Crítico:** usa `crit` + zona general (`arm`, `leg`, `head` o `body`) con la fórmula `1d10 + modificadores` (línea 6149). El exceso de daño y los modificadores pueden subirla.
- **Pifia:** enlace a la clave `fumble` con `1d10` (líneas 2933 y 3256).
- **En `impmal-core`:** cada tabla de críticos tiene 15 resultados que enlazan Ítems `critical` con efectos, y la de pifias, 10 de texto. Al añadir un crítico con varias zonas posibles, el sistema pregunta cuál. Las de vehículos son otra clave y quedan fuera de este plan.

## Radiación y mutaciones

- **Sucumbir:** tirada de Fortitude o Discipline con la opción `mutation` (línea 6851).
- **Si falla:** un d10 elige `mutation` (par) o `malignancy` (impar), tira esa tabla y quita Radiation igual al bonus de `wil`, que en Fallout-Dictum es alias de `fel` (línea 2663).
- **Sin tablas:** la tirada da el error de la sección anterior, porque no lleva fórmula.
- **Con `impmal-core` importado:** los ids coinciden y saldrían mutaciones de Warhammer 40k.

## PNJ (`npc`)

- **Modelo:** `NPCModel` (línea 6869). No admite `role`, `origin` ni `boonLiability` como Ítems, y solo una `faction`.
- **Campos:** `characteristics`, `skills`, `combat`, `notes`, `faction`, `species`, `role` y `warp`.
- **Rol (`system.role`):**

| Rol | Heridas críticas máximas |
|---|---|
| `troop` | 0 |
| `elite` | Suma 1 |
| `leader` | Suma el bonus de `tgh` |

- **Armadura:** `combat.armour` tiene `value`, `formula` y `useItems`. Sin `useItems`, el valor fijo se aplica a todas las zonas (línea 5430).
- **Otros en `combat`:** `size`, `speed`, `wounds`, `criticals`, `hitLocations`, `resolve` y `armourModifier`.
- **Rasgos (`trait`):** tienen `notes`, `attack`, `test`, `roll` y `category`. Los efectos van en el Ítem. Un rasgo de vehículo no se puede poner en un PNJ, ni al revés (línea 16040).
- **Características:** `{ starting, advances, modifier }`.
- **Skills:** `{ characteristic, advances, modifier }`.

## Contenido de `impmal-core` como modelo

- **PNJ:** 55 (22 `troop`, 26 `elite` y 7 `leader`) y 2 vehículos.
- **Ítems dentro de sus actores:** 169 rasgos, 93 armas, 179 de equipo, 126 especializaciones, 30 protecciones, 66 poderes y 14 talentos.
- **Claves antiguas:** sus actores usan `ws`, `bs` y `wil`, que no existen en Fallout-Dictum. No se pueden importar tal cual.
- **Cómo leerlo:** los packs son LevelDB. Se copian a una carpeta temporal y se leen con `classic-level`, sin tocar los originales.

## Cómo se construye un arma

Patrones de las 67 armas de `impmal-core`. Los valores son una guía de equilibrio.

- **A distancia:** casi todas llevan `loud`, incluidos láser y plasma. Solo las evitan las armas pensadas para el sigilo, con `subtle`.
- **Manos:** todo `longGun` y `ordnance` lleva `twohanded` como rasgo, no basta con su especialización.
- **Pistolas:** todas llevan `close`.
- **Armas pesadas de disparo:** `ordnance` con `heavy(4)`.
- **Lanzadores:** categoría `launcher`, sin daño propio. Disparan otro Ítem `weapon` de categoría `grenadesExplosives`, que aporta el daño y los rasgos (líneas 7443 y 9132).
- **Explosivos:** `grenadesExplosives`, con `unstable`. Los lanzables llevan `thrown(Medium)`. Las cargas colocadas usan la especialización `engineering`, sin alcance.
- **Plasma:** usa `supercharge` y `unstable`.
- **Escopetas:** `spread` e `inflict(Prone)`.
- **Cuerpo a cuerpo normal:** a una mano llega como mucho a Strength + 2. Las pesadas a dos manos llevan `heavy(3)` o `heavy(4)`.
- **Precio de munición:** `system.ammoCost` es el coste por recarga que usa la ventana de compra (línea 14573).
- **`unstable`:** su aviso remite a la tabla de pifias: un resultado de 5 o más hace que el arma se destruya (línea 10343). Nuestra tabla de pifias debe respetarlo.

## Cómo se construye una armadura

Patrones de las 30 protecciones de `impmal-core`. `locations.list` admite `head`, `body`, `leftArm`, `rightArm`, `leftLeg` y `rightLeg`.

- **Se suman:** el valor de cada Ítem equipado se suma en cada zona, y el sistema no impide llevar un traje y piezas a la vez (línea 5310).
- **Daño:** se guarda por zona dentro del Ítem (`system.damage`), así que un traje completo puede romperse por partes.
- **Escala:**

| Categoría | Extremidades y cabeza | Cuerpo | Traje completo | Carga |
|---|---|---|---:|---|
| `mundane` | — | 2-3 | 1-2 | 2-5 |
| `flak` | 2 | 3 | 4 | 1-5 |
| `mesh` | 3 | 4 | 4 | 1-3 |
| `carapace` | 5 | 6 | 5-6 | 2-6 |
| `power` | — | — | 8-10 | 8-10 |

- **Trajes:** `mundane` cubre todo menos la cabeza; desde `flak` pueden cubrir también la cabeza.
- **Rasgos:** el rasgo `loud` da Desventaja en sigilo al llevar la armadura (línea 10349). Las pesadas llevan `heavy(3)` o `heavy(4)`, y las discretas, `subtle`.
- **Escudos:** categoría `shield`, sin zonas y con el rasgo `shield(n)`.
- **Servoarmadura:** en `impmal-core`, su efecto, mientras está equipada, deja su carga en 0 y suma 10 a Strength. Las nuestras son un Armazón de servoarmadura con piezas y reemplazan Strength por 55.
- **Efecto condicional:** `shouldTransferEffect` del modelo decide si un efecto de un Ítem llega al actor. Lo usamos para el estado de sellado.
- **Desventaja automática:** un script `dialog` con `args.disadvantage++` y `activateScript`. Cada Desventaja extra se convierte en -10 a la tirada (línea 175).
- **Fijar una característica:** el disparador `computeCharacteristics` corre tras calcular `total` y `bonus`, y antes de skills, carga y Wounds, así que todo usa el valor nuevo. Comprobado en Foundry, incluido el daño cuerpo a cuerpo.
- **Ranuras (`system.slots`):** una protección puede alojar otros Ítems del mismo actor. Un Ítem alojado queda equipado solo mientras lo esté el que lo aloja (línea 7359), y sus efectos y Armour cuentan entonces. No validan el tipo ni la zona. Comprobado en Foundry.
- **Absorber daño:** el disparador `takeDamage` recibe `args.woundsGained`, `args.excess`, `args.critical` y `args.locationData.items` antes de aplicar las Wounds, y puede cambiarlos. Comprobado en Foundry.
- **Augmetic Arm:** usa scripts `dialog` con `args.fields.SL` y `args.fields.damage`, ocultos con `args.data.characteristic` o `args.isAttack` y `args.weapon`. Un brazo da +1 y dos dan +2.
- **Umbrales de carga:** se cambian con el disparador `computeEncumbrance`, sobre `args.encumbrance.overburdened` y `args.encumbrance.restrained`.
- **Opciones ocultas:** siguen en la ventana de tirada con la clase `hidden`. Al probar, hay que mirar si se ven de verdad.

## Cómo se construye un Talento

Patrones de los 93 Talentos de `impmal-core`.

- **Coste:** todos cuestan 100 XP (`system.xpCost`).
- **Requisitos:** 63 piden Avances en una skill o especialización y solo 3 una característica; 21 no piden nada. El texto va en `requirement.value`, y 69 lo comprueban con `requirement.script` al añadirlo.
- **Efectos:** suelen ser situacionales: +1 o +2 SL, Ventaja, una acción gratuita, un rasgo para el arma o una condición al impactar. Según sus textos, los bonos fijos y siempre activos son raros.
- **Coste a cambio:** algunos llevan una pega, como Disturbing Voice (+2 SL y -2 SL según el caso) o Frenzy.
- **Repetir:** varios se pueden comprar otra vez para ganar una opción nueva, como Deadeye, Slippery o Two-handed Cleave.
- **Automatización:** 55 tienen efectos, sobre todo `dialog`; los demás son reglas de mesa.

## Pendiente de comprobar

- Cómo se calculan las Wounds de un PNJ y si `fallout-dictum-stats` afecta a los PNJ igual que a los personajes, incluido Luck.
- Para qué se usa la clave `talents` y si hace falta una tabla propia.

## Modificaciones

- El tipo `modification` es nativo (`impmal.js`, línea 7518) y se aplica a `weapon`, `protection` y `augmetic`. El equipo no tiene ranura de modificaciones.
- Se arrastra a la hoja del Ítem, que guarda una copia en `system.mods`; el original no se gasta (línea 18623). `system.disabled` la desactiva.
- Aporta `addedTraits` y `removedTraits` y efectos con `changes` sobre el Ítem. Se aplican antes de `computeRange`, así que `system.rangeModifier.value` cambia el alcance (líneas 7408 y 9206).
- `impmal-core` trae 10 (como Silencer, Omniscope, Laser Sight y Melee Attachment) e `impmal-requisition`, 11 (como Foregrip y Additional Armour Plating). La bayoneta del libro funciona como una espada aparte, en texto.
