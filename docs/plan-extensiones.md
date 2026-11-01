# Plan de extensiones de Fallout-Dictum

Actualizado el 2026-10-31. Las dudas de reglas se resuelven en la [base de referencia](referencia/README.md).

Las dos extensiones requieren `fallout-dictum-starter`. No requieren `impmal-core` para funcionar: solo se consulta mientras las construimos.

## Decisiones tomadas

- **Mutaciones:** no se inventan por ahora. Fallar la tirada de sucumbir no tira ninguna tabla, para evitar el error del sistema y las mutaciones de Warhammer 40k.
- **Críticos y pifias:** usan la misma estructura y progresión de gravedad que `impmal-core`, y las mismas claves y dados del sistema, pero cada resultado se escribe de nuevo para Fallout. No se copian ni se retocan sus textos.
- **PNJ:** usan el modelo del sistema y la progresión `troop`, `elite` y `leader` de `impmal-core`, con nuestras claves y contenido propio.
- **Distribución:** el contenido grande va en compendios de Foundry generados desde `data\`, no creado en cada mundo como en Starter. Las tablas sí se crean en el mundo, porque el ajuste del sistema solo acepta tablas del mundo.
- **Tablas:** se asignan solo si el ajuste está vacío o conserva el id original del sistema, para no pisar las que haya elegido el máster.

## Extensión 1: `fallout-dictum-wasteland` (hecha)

La prueba con jugadores ya se hizo y el combate funcionó sin problemas. Pidieron más variedad de armas y Perks, y una tabla de pifias.

Se trabaja por fases. En cada una se aprueba primero la lista de lo que se va a crear; después se crea y se pasa a la siguiente.

| Fase | Trabajo | Organización |
|---|---|---|
| 1. Base (hecha) | Módulo, compendios, generación desde `data\` y bloqueo de las tablas de mutación | Fallar al sucumbir no da error |
| 2. Armas (hecha) | 48 armas y 3 municiones | A distancia por tipo; cuerpo a cuerpo en normales y especiales; ligeras, medianas y pesadas. Las pesadas siempre son a dos manos. |
| 3. Armaduras (hecha) | 33 armaduras, ServoEsqueleto, 48 piezas de 8 modelos y Núcleo de fusión | Piezas por zona, trajes completos y escudos; servoarmaduras separadas por modelo |
| 4. Consumibles (hecha) | 16 consumibles | Curación, Radiación, Drogas y Comida y bebida |
| 5. Perks (hecha) | 30 Perks, construidos como los Talentos de `impmal-core` | A distancia, Cuerpo a cuerpo y explosivos, Defensa, Yermo, y Habilidad y social |
| 6. Tablas (hecha) | Pifias y críticos por zona, con 60 Ítems de herida | 10 pifias y 15 resultados por zona |
| 7. Cierre (hecha) | Prueba en Foundry, CLAUDE.md y guía en PDF | `node docs/generate.mjs` incluye el contenido nuevo |

## Extensión 2: `fallout-dictum-bestiary` (aplazada)

No se empieza hasta terminar `fallout-dictum-wasteland`.

Objetivo: enemigos listos para usar y una forma rápida de crear muchos.

| Fase | Trabajo | Objetivo inicial |
|---|---|---|
| 1. Importador | Importar JSON y convertirlo en actores `npc` | Crear un PNJ válido desde un archivo |
| 2. Rasgos | Rasgos reutilizables de criaturas y robots | Según los pida el bestiario |
| 3. Bestiario | Necrófagos, saqueadores, supermutantes, robots y fauna, en compendio | 25 PNJ repartidos entre `troop`, `elite` y `leader` |
| 4. Cierre | Prueba en combate, CLAUDE.md y guía del máster | Combate completo contra cada familia |

### Importador

El formato es propio y sencillo, para que cualquier programa pueda generarlo. Se publica con un JSON Schema para validar antes de importar.

```json
{
  "version": 1,
  "actors": [
    {
      "key": "feral-ghoul",
      "name": "Necrófago salvaje",
      "role": "troop",
      "species": "Necrófago",
      "size": "medium",
      "characteristics": { "str": 35, "per": 25, "tgh": 35, "fel": 10, "int": 10, "ag": 30 },
      "skills": { "melee": 10, "awareness": 5 },
      "armour": { "value": 1 },
      "items": ["Machete"],
      "traits": [{ "name": "Inmune a la radiación", "notes": "No recibe Radiation." }],
      "notes": "Ataca en grupo."
    }
  ]
}
```

Los valores son solo un ejemplo del formato, no estadísticas definitivas.

Comportamiento:

- **Vista previa:** antes de crear nada, muestra cuántos actores se crearán o actualizarán y los errores de cada uno.
- **Claves:** rechaza `ws`, `bs`, `wil` y `psychic`, y cualquier característica o skill que no exista.
- **Ítems:** los busca por nombre en los compendios de Fallout-Dictum y en el mundo. Si no encuentra uno, lo marca como error.
- **Volver a importar:** `key` identifica al actor, así que actualiza el existente en lugar de duplicarlo.
- **Exportar:** también convierte un PNJ del mundo a este formato, para usarlo como plantilla.

## Orden

1. Extensión 1, fases 1 a 7, una categoría cada vez.
2. Extensión 2. Va al final porque los PNJ usan las armas de la primera.

## Fuera de este plan

Vehículos, compañeros, patrones, implantes, adicción, hambre y sed, y mutaciones propias.
