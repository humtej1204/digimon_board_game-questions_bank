# Banco de preguntas · Digimon Board Game

Sitio estático e independiente, listo para publicarse en GitHub Pages. No necesita instalación ni compilación. Incluye las tres pantallas: acceso por código, selección de dificultad y carta reversible de pregunta/respuesta. El banco contiene **1330 preguntas** repartidas entre cinco niveles; las primeras diez de cada nivel forman las **50 preguntas demo**.

## Cómo se juega

1. **Acceso:** escribe un código diario vigente o el código maestro. Si no es válido, aparece un aviso y no se avanza. El código determina si se muestran solo preguntas demo o todo el banco.
2. **Nivel:** elige una dificultad de una a cinco estrellas. El nivel 3 aparece como recomendado.
3. **Filtros y pregunta:** en la pantalla de la carta, abre **Filtrar preguntas** y marca las obras o temas que quieras. Si no marcas ninguno, entran todas las preguntas disponibles del nivel. **Otra pregunta** elige otra de ese conjunto; el sistema recorre todas antes de repetirlas y evita una repetición consecutiva al comenzar un nuevo recorrido.
4. **Respuesta:** **Ver respuesta** gira la carta y muestra la respuesta y, si se ha escrito, una explicación breve. **Ver pregunta** devuelve la carta al frente.
5. **Navegación:** usa el selector encima de la carta para cambiar directamente de nivel, **Cambiar nivel** para volver a los cinco niveles o **Inicio** para regresar al acceso. Al regresar al inicio se reinicia la sesión local.

Al elegir un nivel, pedir **Otra pregunta**, cambiar de nivel, modificar los filtros o recargar en la pantalla de juego, la carta muestra un loader centrado durante **1 segundo** antes de revelar una nueva pregunta. Si se hace otra selección durante la espera, se cancela la anterior y el segundo empieza de nuevo para la última elección. Girar la carta para ver u ocultar la respuesta no activa la carga. El tiempo está en `QUESTION_LOADING_MS` dentro de `js/app.js`.

La distribución se adapta a escritorio y teléfono. La carta y los botones son elementos independientes: los botones no giran con ella. El diseño reutiliza colores, iconos y fondos de las cartas y fichas del juego.

## Filtros de preguntas

El botón **Filtrar preguntas** abre un popup con **Anime**, **Juegos con historia**, **Manga, cómics y novelas** y **Temas generales**. Cada categoría tiene una casilla para marcar o desmarcar todas sus etiquetas; si solo algunas están marcadas, la casilla muestra un estado parcial. La categoría no es una etiqueta adicional: su casilla selecciona las etiquetas individuales. Puedes cerrar el popup con **Ver pregunta**, la X o Escape. La lista exacta de etiquetas e identificadores está en `FILTER_GROUPS` dentro de `js/data.js`.

- **Ningún filtro marcado:** se muestran todas las preguntas permitidas por el código y el nivel.
- **Casilla de categoría:** marca o desmarca todas las opciones de esa categoría sin afectar las otras. Las preguntas siguen combinándose con OR.
- **Uno o más filtros marcados:** se muestra una pregunta si tiene **al menos una** etiqueta seleccionada. Es una unión **OR**, nunca se exige que coincidan todas.
- El permiso demo/completo y el nivel se aplican **antes** del filtro. Filtrar no permite acceder a preguntas fuera de las primeras diez demo.
- Si no hay coincidencias en un nivel, la carta se sustituye por un mensaje. Puedes cambiar de nivel o quitar filtros.
- Los filtros permanecen seleccionados al cambiar de nivel y se limpian al volver al inicio.

Las películas y especiales que continúan una temporada usan la etiqueta de esa serie: por ejemplo, *tri.* y *Last Evolution Kizuna* usan `anime-adventure`, y *The Beginning* usa `anime-adventure-02`. No hay un filtro independiente de películas. *X-Evolution*, que no pertenece a una temporada, puede etiquetarse con `topic-x-antibody` y/o `topic-lore`. Todos los títulos de la familia **Digimon World** comparten `game-world`, incluidos *World*, *World 2*, *World 3/2003*, *World X/4*, *Re:Digitize/Decode* y *Next Order*. Si una pregunta del juego *Savers: Another Mission / World Data Squad* trata su contenido propio, también puede usar `game-world`.

Cada pregunta lleva `tags`, una lista de identificadores estables que pueden combinar obra y tema:

```js
{
  question: "¿Qué objeto permite la evolución Armor?",
  answer: "Un Digimental.",
  detail: "Explicación opcional.",
  tags: ["anime-adventure-02", "topic-special-evolution", "topic-digimentals"]
}
```

Una pregunta sobre los emblemas de Adventure puede llevar `anime-adventure`, `topic-artifacts` y `topic-crests`. Añade solo etiquetas pertinentes al contenido: no etiquetes automáticamente todas las adaptaciones que repiten un dato. Los `tags` no aparecen en la carta: solo sirven para decidir qué preguntas incluye cada filtro. Todos los identificadores usados por el banco pertenecen al catálogo `FILTER_GROUPS`. Todos los filtros tienen ya al menos seis preguntas en cada nivel para el acceso completo. Una selección aún podría quedar vacía en modo demo, porque ese permiso solo dispone de las primeras diez preguntas de cada nivel.

## Códigos de acceso

Los códigos diarios se calculan con la fecha de **Bogotá** (`America/Bogota`) en formato `DDMMAAAA`. Se escriben sin espacios ni guiones: `FECHA + NOMBRE + FECHA_INVERTIDA`.

Por ejemplo, el 25 de septiembre de 2026: `25092026HARU62029052`. Ese mismo día, un código demo sería `25092026NYRM62029052`. Al pasar la medianoche en Bogotá, los códigos diarios anteriores dejan de funcionar. Se aceptan letras minúsculas y espacios al principio o al final de lo escrito.

| Permiso | Nombres o código | Preguntas visibles |
| --- | --- | --- |
| Demo | `NYRM`, `CHINEFILO`, `MALDORICK`, `DIGIELEGIDOS`, `DIGIGAMERS` | Las primeras 10 de cada nivel: 50 preguntas en total. |
| Completo | `HARU`, `WESTON`, `BRENDA`, `DIGIMONBOARDGAME` | Todas las preguntas de cada nivel. |
| Maestro | `HARUISTHEBEST` (sin fecha) | Todas las preguntas; no caduca cada día. |

### Contrato para futuras modificaciones

- Los nombres, su permiso, el código maestro, la zona horaria y el límite demo están en `js/data.js` (`ACCESS_NAMES`, `MASTER_CODE`, `CODE_TIME_ZONE`, `DEMO_LIMIT_PER_LEVEL`).
- `getDateStamp()` construye `DDMMAAAA`; `makeDailyCode()` añade el nombre y la fecha invertida. Los códigos diarios se generan al validar el formulario, no se guardan en una lista que haya que actualizar cada día.
- `getAccessTier()` devuelve `demo`, `full`, `master` o `null`. `js/app.js` guarda ese permiso durante la sesión y usa `getQuestionsForLevel()` para impedir que una cuenta demo vea preguntas fuera de las primeras diez de su nivel.
- Tras validar un código, `localStorage.isLogued` queda en `"true"` y `questionsBankSession` guarda el permiso, la fecha de acceso, la pantalla, el nivel, los filtros y el estado del sorteo; **no guarda el código escrito**. F5 conserva pantalla, nivel y filtros, pero sortea una pregunta nueva si estabas en la pantalla de juego. **Inicio** pone `isLogued` en `"false"` y elimina la sesión guardada. Los accesos diarios guardados caducan al cambiar la fecha de Bogotá; el maestro no caduca.
- Las primeras 10 entradas de `QUESTIONS` en `js/data.js` son las preguntas demo de cada nivel. Las preguntas de `js/literature-data.js` y `js/game-data.js` se agregan al final de cada nivel; son exclusivas del acceso completo. Si cambias el orden de las diez primeras, cambia lo que ve el modo demo. Cada pregunta debe llevar `tags`.
- `getQuestionsForLevel(level, tier, selectedTags)` limita primero por permiso y luego filtra por coincidencia OR. Un conjunto vacío de etiquetas seleccionadas devuelve todas las preguntas accesibles.
- Si se agregan nuevos nombres, colócalos en el grupo correcto de `ACCESS_NAMES`. Si cambias la regla de fecha o los permisos, actualiza también esta sección y las pruebas.

**Seguridad:** los códigos y las respuestas están en archivos JavaScript públicos. Este acceso organiza la experiencia de juego, pero no es autenticación real ni protege preguntas secretas.

## Archivos del proyecto

| Ruta | Función |
| --- | --- |
| `index.html` | Estructura de las tres pantallas y sus controles. |
| `styles.css` | Diseño, versión móvil y animación de la carta. |
| `js/app.js` | Validación del código, sesión local, navegación, filtros, sorteo, carga de 1 segundo y giro. |
| `js/data.js` | Códigos, niveles, catálogo de filtros y banco principal de preguntas. |
| `js/literature-data.js` | Preguntas adicionales de manga, cómics y novelas, organizadas por nivel. |
| `js/game-data.js` | Preguntas de los doce filtros de juegos con historia, seis nuevas por nivel y filtro. |
| `scripts/check-questions.mjs` | Recuento y comprobación de cobertura, duplicados exactos y etiquetas. |
| `assets/` | Copias de los recursos visuales originales del juego. |
| `.nojekyll` | Publicación directa de los archivos estáticos en GitHub Pages. |

## Probarlo localmente

Desde esta carpeta inicia un servidor web local, por ejemplo:

```powershell
py -m http.server 8000
```

Después abre `http://localhost:8000`. Puedes probar con un código diario generado según las reglas descritas arriba o con el código maestro. La página usa módulos JavaScript; abrir `index.html` directamente como archivo puede impedir que carguen en algunos navegadores.

## Cambiar el contenido

Edita `js/data.js`, `js/literature-data.js` o `js/game-data.js` según el grupo:

- `ACCESS_NAMES`, `MASTER_CODE`, `CODE_TIME_ZONE` y `DEMO_LIMIT_PER_LEVEL`: nombres autorizados, permisos y reglas de los códigos.
- `QUESTIONS` en `js/data.js`: banco principal por nivel (1–5), incluidas las diez entradas demo de cada nivel. `LITERATURE_QUESTIONS` en `js/literature-data.js`: ampliación literaria. `GAME_QUESTIONS` en `js/game-data.js`: ampliación de juegos con historia. `js/data.js` agrega ambas al final de cada nivel. Cada entrada tiene `question`, `answer` y `tags`; `detail` es opcional.
- `FILTER_GROUPS`: nombres visibles e identificadores estables de los filtros.
- `LEVELS`: nombres visibles de los niveles.

Cada nivel de `QUESTIONS` es una lista de objetos con este formato:

```js
{ question: "¿Pregunta?", answer: "Respuesta.", detail: "Explicación opcional.", tags: ["anime-adventure", "topic-crests"] }
```

Añade, elimina o modifica las preguntas del banco principal en `QUESTIONS` de `js/data.js`. Para manga, cómics y novelas, edita `LITERATURE_QUESTIONS` de `js/literature-data.js`, dentro de la lista de su nivel. Para juegos, edita `GAME_SETS` en `js/game-data.js`: cada clave es un ID de filtro y contiene cinco listas, una por nivel del 1 al 5; cada entrada es `["pregunta", "respuesta"]`. El módulo convierte esas parejas en objetos con su `tag` y `js/data.js` las incorpora sin compilación. Cada `question` debe formular un dato concreto, con una `answer` breve y no ambigua; evita preguntas casi iguales a otras existentes. Usa solo IDs de `FILTER_GROUPS` en `tags`. Los filtros combinan etiquetas con OR; las etiquetas no se muestran en la carta. `detail` puede omitirse. Mantén al menos una pregunta por nivel; con dos o más, **Otra pregunta** puede mostrar una diferente.

**Criterio editorial:** pregunta por hechos de la historia, personajes, Digimon, evoluciones, objetos o lore. No incluyas números o títulos de capítulos y episodios, tomos o volúmenes, revistas, fechas de publicación ni autores/ilustradores; tampoco aunque el nivel sea 5. Sustituye esos datos por un hecho narrativo concreto, sin repetir otra pregunta ni depender de una respuesta larga.
| Nivel | Total | Demo |
| --- | ---: | ---: |
| 1 estrella | 277 | 10 |
| 2 estrellas | 273 | 10 |
| 3 estrellas | 263 | 10 |
| 4 estrellas | 247 | 10 |
| 5 estrellas | 270 | 10 |
| **Total** | **1330** | **50** |

Las **primeras diez** entradas de cada nivel son las visibles con acceso demo; todas son visibles con acceso completo o maestro. Si cambias ese orden, cambiarás la selección demo. Al añadir preguntas, actualiza la tabla anterior.

### Meta de cobertura por filtros

El objetivo es **un mínimo de 6 preguntas por cada filtro en cada nivel**, intentando llegar a **10** cuando haya datos distintos y verificables. Los **52 filtros** y sus **260 combinaciones** de nivel cumplen ya el mínimo: **0 asignaciones pendientes**. En juegos se añadieron seis preguntas nuevas por filtro y nivel; algunas combinaciones tienen más por las entradas anteriores. Una pregunta puede cubrir varios filtros solo si todos sus `tags` son pertinentes; no se deben inventar etiquetas ni repetir el mismo dato con otra redacción.

Ejecuta `node scripts/check-questions.mjs --enforce` desde la raíz del proyecto para comprobar la cobertura completa, los duplicados exactos, los `tags` y la ausencia de preguntas sobre capítulos, episodios, tomos o datos editoriales. Para revisar un grupo por separado usa `--general`, `--anime`, `--literature` o `--games` junto con `--enforce`. Los cinco comandos deben terminar sin errores. El control de duplicados exactos no sustituye la revisión editorial de preguntas que expresen el mismo hecho con otras palabras.


El contenido se carga desde los archivos publicados: no hay base de datos ni cuentas reales. La sesión se conserva solo en el almacenamiento local de ese navegador. Al recargar se mantienen el acceso, la pantalla, el nivel y los filtros; en el juego se sortea otra pregunta y vuelve a mostrarse el frente de la carta. Inicio borra la sesión. Si el código era diario, una recarga posterior a la medianoche de Bogotá exige ingresar un código vigente.

El selector evita repetir una pregunta hasta agotar las disponibles de su nivel y procura no repetir inmediatamente al reiniciar la lista.
### Fuentes para revisar o ampliar el banco

Antes de publicar nuevas preguntas, comprueba nombres y variantes en fuentes oficiales: [Digimon Encyclopedia](https://digimon.net/reference_en/) para especies, grupos y técnicas; [Toei Animation](https://lineup.toei-anim.co.jp/) para las series; [portal oficial de juegos de Bandai Namco](https://digimon-gameportal.bn-ent.net/product/) para las historias de los juegos; [Bandai Toys](https://toy.bandai.co.jp/) para los dispositivos, y [Digimon Liberator](https://digimoncard.com/digimon_liberator/en/) para el webcómic y la novela. Para regiones, administradores y mitología del Mundo Digital se usaron también las páginas oficiales de [Iliad](https://digimon.net/digitalworld-Iliad/) y [Shambhala](https://digimon.net/digitalworld-shambala/). Las películas están agrupadas con sus temporadas según la convención de filtros de esta página.

Para manga y novelas se consultaron las sinopsis editoriales de [V-Tamer 01](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08806017806017335501) y [Dreamers](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883320-0), la [novela y fichas de Seekers](https://digimon.net/digimonseekers/), las [fichas y relatos de Liberator](https://digimoncard.com/digimon_liberator/en/) y el [relato oficial de Chronicle X](https://digimon.net/x-evo/). Para *Next*, el manga de *Xros Wars* y *Re:Digitize Encode* se consultaron además fichas secundarias de [Wikimon](https://wikimon.net/); antes de publicar revisiones de esas obras conviene contrastar los detalles con sus tomos originales.

Para juegos se consultaron las [fichas oficiales de Time Stranger](https://digimonstory-ts.bn-ent.net/character/), [Survive](https://en.bandainamcoent.eu/digimon/digimon-survive), [Adventure de PSP](https://digimon-gameportal.bn-ent.net/product/adventure/), [Lost Evolution](https://digimon-gameportal.bn-ent.net/product/ds_digimon_lost/intro.html), [Super Xros Wars](https://digimon-gameportal.bn-ent.net/product/xros_wars/story/) y [Next Order](https://en.bandainamcoent.eu/digimon/digimon-world-next-order). Para argumentos detallados de juegos antiguos, Cyber Sleuth y ReArise se contrastaron también las fichas secundarias de [Wikimon](https://wikimon.net/). Antes de publicar cambios de trama especialmente específicos, conviene verificarlos en el juego original.

Para las preguntas de Anime se consultaron las [fichas y episodios oficiales de Toei](https://lineup.toei-anim.co.jp/ja/series/digimon/). Para *Beatbreak*, que sigue incorporando personajes y evoluciones, consulta su [página oficial](https://www.toei-anim.co.jp/tv/digimon_beatbreak/) y usa el [catálogo oficial del juego de cartas](https://world.digimoncard.com/cards/) para comprobar la grafía inglesa de nombres nuevos como Armalizamon, Monarchlizamon y Wolvermon. La revisión de estas preguntas se hizo con información disponible el 25 de septiembre de 2026; contrasta cualquier novedad antes de añadir más.


**Importante:** el código de acceso es solo una puerta visual para jugar. Al ser un sitio estático, tanto los códigos como las respuestas quedan visibles para quien inspeccione los archivos publicados; no sirve para proteger información secreta.

## Publicarlo en GitHub Pages

Sube el contenido de esta carpeta a la raíz de un repositorio de GitHub. En *Settings → Pages*, selecciona *Deploy from a branch*, la rama principal y la carpeta `/ (root)`. Todos los recursos usan rutas relativas, de modo que funcionará también bajo una URL de proyecto como `usuario.github.io/repositorio/`. El archivo `.nojekyll` evita procesamiento innecesario de Jekyll.

### Configuración de este repositorio

Repositorio: [humtej1204/digimon_board_game-questions_bank](https://github.com/humtej1204/digimon_board_game-questions_bank).

1. Abre **Settings → Pages** en el repositorio.
2. En **Build and deployment → Source**, elige **Deploy from a branch**.
3. Selecciona **main** y **/ (root)**.
4. Pulsa **Save** y espera a que termine la publicación.

La dirección prevista es [humtej1204.github.io/digimon_board_game-questions_bank/](https://humtej1204.github.io/digimon_board_game-questions_bank/). Si aún no abre, comprueba la publicación en **Actions** o en **Settings → Pages**.

[Guía oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Recursos reutilizados

Los archivos de `assets/` son copias locales de recursos existentes del juego, para que este proyecto se pueda publicar de forma independiente:

| Archivo aquí | Procedencia en el proyecto del juego |
| --- | --- |
| `card-bg.png` | `digimon_card_action/assets/bg.png` |
| `h-logo.png` | `digimon_carta_reverso/assets/h-logo.png` |
| `chevrons-white.png` | `digimon_trade/assets/icons/individual/chevrons_white.png` |
| `reset.png` | `digimon_trade/assets/icons/individual/reset.png` |
| `star.png` | `digimon_trade/assets/icons/individual/star.png` |

No se generaron imágenes nuevas; las demás formas, insignias y fondos están hechos con CSS.
