# Banco de preguntas · Digimon Board Game

Sitio estático e independiente, listo para publicarse en GitHub Pages. No necesita instalación ni compilación. Incluye las tres pantallas: acceso por código, selección de dificultad y carta reversible de pregunta/respuesta.

## Cómo se juega

1. **Acceso:** escribe un código incluido en la lista de códigos válidos. El código de demostración es `DIGIMON`. Si el código no existe, aparece un aviso y no se avanza.
2. **Nivel:** elige una dificultad de una a cinco estrellas. El nivel 3 aparece como recomendado.
3. **Pregunta:** aparece una carta con una pregunta elegida al azar dentro del nivel. **Otra pregunta** muestra otra del mismo nivel; el sistema recorre todas antes de repetirlas y evita una repetición consecutiva al comenzar un nuevo recorrido.
4. **Respuesta:** **Ver respuesta** gira la carta y muestra la respuesta y una explicación breve. **Ver pregunta** devuelve la carta al frente.
5. **Navegación:** usa el selector encima de la carta para cambiar directamente de nivel, **Cambiar nivel** para volver a los cinco niveles o **Inicio** para regresar al acceso. Al regresar al inicio se reinicia la sesión local.

La distribución se adapta a escritorio y teléfono. La carta y los botones son elementos independientes: los botones no giran con ella. El diseño reutiliza colores, iconos y fondos de las cartas y fichas del juego.

## Archivos del proyecto

| Ruta | Función |
| --- | --- |
| `index.html` | Estructura de las tres pantallas y sus controles. |
| `styles.css` | Diseño, versión móvil y animación de la carta. |
| `js/app.js` | Validación del código, navegación, sorteo y giro. |
| `js/data.js` | Códigos, niveles y preguntas editables. |
| `assets/` | Copias de los recursos visuales originales del juego. |
| `.nojekyll` | Publicación directa de los archivos estáticos en GitHub Pages. |

## Probarlo localmente

Desde esta carpeta inicia un servidor web local, por ejemplo:

```powershell
py -m http.server 8000
```

Después abre `http://localhost:8000`. El código de prueba es **DIGIMON**. La página usa módulos JavaScript; abrir `index.html` directamente como archivo puede impedir que carguen en algunos navegadores.

## Cambiar el contenido

Edita `js/data.js`:

- `VALID_CODES`: lista de códigos aceptados.
- `QUESTIONS`: preguntas, respuestas y detalles por nivel (1–5).
- `LEVELS`: nombres visibles de los niveles.

Cada nivel de `QUESTIONS` es una lista de objetos con este formato:

```js
{ question: "¿Pregunta?", answer: "Respuesta.", detail: "Explicación opcional." }
```

Añade cada pregunta en la lista de su nivel (1, 2, 3, 4 o 5). Mantén al menos una pregunta por nivel; con dos o más, **Otra pregunta** puede mostrar una diferente. Los códigos se comparan sin distinguir mayúsculas/minúsculas ni espacios al principio o al final, así que conviene escribirlos en mayúsculas en `VALID_CODES`.

El contenido se carga desde los archivos publicados: no hay base de datos, cuentas ni guardado de progreso. Recargar la página reinicia la sesión.

Las diez preguntas incluidas son **ejemplos del prototipo**, no el banco definitivo. El selector evita repetir una pregunta hasta agotar las de su nivel y procura no repetir inmediatamente al reiniciar la lista.

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
