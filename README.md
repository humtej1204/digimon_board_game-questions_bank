# Banco de preguntas · Digimon Board Game

Sitio estático e independiente, listo para publicarse en GitHub Pages. No necesita instalación ni compilación. Incluye las tres pantallas: acceso por código, selección de dificultad y carta reversible de pregunta/respuesta.

## Cómo se juega

1. **Acceso:** escribe un código diario vigente o el código maestro. Si no es válido, aparece un aviso y no se avanza. El código determina si se muestran solo preguntas demo o todo el banco.
2. **Nivel:** elige una dificultad de una a cinco estrellas. El nivel 3 aparece como recomendado.
3. **Filtros y pregunta:** en la pantalla de la carta, abre **Filtrar preguntas** y marca las obras o temas que quieras. Si no marcas ninguno, entran todas las preguntas disponibles del nivel. **Otra pregunta** elige otra de ese conjunto; el sistema recorre todas antes de repetirlas y evita una repetición consecutiva al comenzar un nuevo recorrido.
4. **Respuesta:** **Ver respuesta** gira la carta y muestra la respuesta y una explicación breve. **Ver pregunta** devuelve la carta al frente.
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

Una pregunta sobre los emblemas de Adventure puede llevar `anime-adventure`, `topic-artifacts` y `topic-crests`. Añade solo etiquetas pertinentes al contenido: no etiquetes automáticamente todas las adaptaciones que repiten un dato. Las cuatro preguntas iniciales sobre fichas o iconos del juego de mesa llevan `prototype-board-game` como etiqueta interna del prototipo; no hay un filtro público de reglas del juego de mesa en el catálogo aprobado, así que aparecen al dejar todos los filtros sin marcar. Al sustituirlas por el banco definitivo, usa las etiquetas de `FILTER_GROUPS` para cada pregunta.

## Códigos de acceso

Los códigos diarios se calculan con la fecha de **Bogotá** (`America/Bogota`) en formato `DDMMAAAA`. Se escriben sin espacios ni guiones: `FECHA + NOMBRE + FECHA_INVERTIDA`.

Por ejemplo, el 25 de septiembre de 2026: `25092026HARU62029052`. Ese mismo día, un código demo sería `25092026NYRM62029052`. Al pasar la medianoche en Bogotá, los códigos diarios anteriores dejan de funcionar. Se aceptan letras minúsculas y espacios al principio o al final de lo escrito.

| Permiso | Nombres o código | Preguntas visibles |
| --- | --- | --- |
| Demo | `NYRM`, `CHINEFILO`, `MALDORICK`, `DIGIELEGIDOS`, `DIGIGAMERS` | Las primeras 10 de cada nivel; máximo 50 cuando el banco esté completo. |
| Completo | `HARU`, `WESTON`, `BRENDA`, `DIGIMONBOARDGAME` | Todas las preguntas de cada nivel. |
| Maestro | `HARUISTHEBEST` (sin fecha) | Todas las preguntas; no caduca cada día. |

### Contrato para futuras modificaciones

- Los nombres, su permiso, el código maestro, la zona horaria y el límite demo están en `js/data.js` (`ACCESS_NAMES`, `MASTER_CODE`, `CODE_TIME_ZONE`, `DEMO_LIMIT_PER_LEVEL`).
- `getDateStamp()` construye `DDMMAAAA`; `makeDailyCode()` añade el nombre y la fecha invertida. Los códigos diarios se generan al validar el formulario, no se guardan en una lista que haya que actualizar cada día.
- `getAccessTier()` devuelve `demo`, `full`, `master` o `null`. `js/app.js` guarda ese permiso durante la sesión y usa `getQuestionsForLevel()` para impedir que una cuenta demo vea preguntas fuera de las primeras diez de su nivel.
- Tras validar un código, `localStorage.isLogued` queda en `"true"` y `questionsBankSession` guarda el permiso, la fecha de acceso, la pantalla, el nivel, los filtros y el estado del sorteo; **no guarda el código escrito**. F5 conserva pantalla, nivel y filtros, pero sortea una pregunta nueva si estabas en la pantalla de juego. **Inicio** pone `isLogued` en `"false"` y elimina la sesión guardada. Los accesos diarios guardados caducan al cambiar la fecha de Bogotá; el maestro no caduca.
- Al añadir el banco definitivo, coloca exactamente las 10 preguntas demo al inicio de la lista de cada nivel en `QUESTIONS`; después añade las exclusivas de acceso completo. Si cambia el orden, también cambia qué preguntas ve el modo demo. Cada pregunta debe llevar `tags`.
- `getQuestionsForLevel(level, tier, selectedTags)` limita primero por permiso y luego filtra por coincidencia OR. Un conjunto vacío de etiquetas seleccionadas devuelve todas las preguntas accesibles.
- Si se agregan nuevos nombres, colócalos en el grupo correcto de `ACCESS_NAMES`. Si cambias la regla de fecha o los permisos, actualiza también esta sección y las pruebas.

**Seguridad:** los códigos y las respuestas están en archivos JavaScript públicos. Este acceso organiza la experiencia de juego, pero no es autenticación real ni protege preguntas secretas.

## Archivos del proyecto

| Ruta | Función |
| --- | --- |
| `index.html` | Estructura de las tres pantallas y sus controles. |
| `styles.css` | Diseño, versión móvil y animación de la carta. |
| `js/app.js` | Validación del código, sesión local, navegación, filtros, sorteo, carga de 1 segundo y giro. |
| `js/data.js` | Códigos, niveles, catálogo de filtros y preguntas editables. |
| `assets/` | Copias de los recursos visuales originales del juego. |
| `.nojekyll` | Publicación directa de los archivos estáticos en GitHub Pages. |

## Probarlo localmente

Desde esta carpeta inicia un servidor web local, por ejemplo:

```powershell
py -m http.server 8000
```

Después abre `http://localhost:8000`. Puedes probar con un código diario generado según las reglas descritas arriba o con el código maestro. La página usa módulos JavaScript; abrir `index.html` directamente como archivo puede impedir que carguen en algunos navegadores.

## Cambiar el contenido

Edita `js/data.js`:

- `ACCESS_NAMES`, `MASTER_CODE`, `CODE_TIME_ZONE` y `DEMO_LIMIT_PER_LEVEL`: nombres autorizados, permisos y reglas de los códigos.
- `QUESTIONS`: preguntas, respuestas, detalles y etiquetas por nivel (1–5).
- `FILTER_GROUPS`: nombres visibles e identificadores estables de los filtros.
- `LEVELS`: nombres visibles de los niveles.

Cada nivel de `QUESTIONS` es una lista de objetos con este formato:

```js
{ question: "¿Pregunta?", answer: "Respuesta.", detail: "Explicación opcional.", tags: ["anime-adventure", "topic-crests"] }
```

Añade cada pregunta en la lista de su nivel (1, 2, 3, 4 o 5). Mantén al menos una pregunta por nivel; con dos o más, **Otra pregunta** puede mostrar una diferente. Las primeras diez preguntas de cada lista son las que puede ver el acceso demo; todas son visibles con acceso completo o maestro.

El contenido se carga desde los archivos publicados: no hay base de datos ni cuentas reales. La sesión se conserva solo en el almacenamiento local de ese navegador. Al recargar se mantienen el acceso, la pantalla, el nivel y los filtros; en el juego se sortea otra pregunta y vuelve a mostrarse el frente de la carta. Inicio borra la sesión. Si el código era diario, una recarga posterior a la medianoche de Bogotá exige ingresar un código vigente.

Las diez preguntas actuales son **ejemplos del prototipo**: solo hay dos por nivel. El límite demo ya es de diez por nivel, pero no habrá 50 preguntas demo hasta que se cargue el banco definitivo. El selector evita repetir una pregunta hasta agotar las disponibles de su nivel y procura no repetir inmediatamente al reiniciar la lista.

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
