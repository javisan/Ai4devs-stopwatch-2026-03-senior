Crea un meta promt de:
Crea un cronómetro a en un fichero index.html que llama un script.js, la referencia de UX es la imágen que te incluyo. Este cronómetro indicará horas:minutos:segundos y 3 dígitos para los milisegundos.
Debajo del contador hay 2 botones:
El botón 1, inicialmente, con el contador a 0, se mostrará "Start" que cambiará a "Pause" cuando la cuenta haya iniciado y si se pulsa sobre "Pause" se llamará "Continue".
El segundo botón se llama "Clear" y realiza el stop del cronómetro a 0 y reinicia el botón 1 a "Start".
El cronómetro mostrará el avance del tiempo con precisión de milisegundos, actualizará la interfaz con la mejor frecuencia que permita el navegador.
El estilo se basará en los ejemplos pero modernizando los componentes.
La secuencia de imágenes muestra:
1. Estado inicial.
2. Cronómetro iniciado.
3. Cronómetro pausado.
1. Cronómetro continuado.
2. Cronómetro finalizado "Clear".

---------------

Actúa como un brillante desarrollador senior y genera el fichero index.html y script.js en base a esta definición.

---

## Meta-Prompt: Cronómetro Web (index.html + script.js)

**Contexto y objetivo**
Crea un cronómetro web de alta precisión dividido en dos archivos: `index.html` y `script.js`. La interfaz replica el diseño de referencia modernizando los componentes visuales.

---

**Especificación funcional**

*Display del cronómetro*
- Formato: `HH:MM:SS` en tipografía monoespaciada grande
- Subíndice de 3 dígitos para milisegundos (000–999), alineado a la derecha bajo los segundos
- Fondo del display: azul claro (`#dce8ff`) con borde redondeado y sombra sutil
- Actualización: usa `requestAnimationFrame` para máxima fluidez; calcula el tiempo con `performance.now()` o `Date.now()` para precisión real

*Lógica de estados y botones*

El sistema tiene tres estados: **STOPPED**, **RUNNING**, **PAUSED**

| Estado actual | Botón 1 muestra | Botón 1 acción | Botón 2 (Clear) |
|---|---|---|---|
| STOPPED | `Start` (verde) | → RUNNING | Deshabilitado o inactivo |
| RUNNING | `Pause` (verde) | → PAUSED | Detiene y resetea → STOPPED |
| PAUSED | `Continue` (azul) | → RUNNING | Detiene y resetea → STOPPED |

- **Clear** siempre reinicia el tiempo a `00:00:00` y `000` ms, y devuelve el Botón 1 a `Start`

---

**Especificación de estilos (modernización del diseño de referencia)**

```
Paleta:
  - Display bg: #e8eeff  
  - Display border: #3a3a4a  
  - Botón Start/Pause: verde (#4caf50 → #388e3c en hover)  
  - Botón Continue: azul (#42a5f5 → #1565c0 en hover)  
  - Botón Clear: rojo (#e53935 → #b71c1c en hover)  
  - Fondo página: blanco o gris muy claro  

Tipografía display:
  - font-family: 'Segment7', 'DS-Digital', 'Courier New', monospace  
  - font-size: clamp(4rem, 12vw, 7rem)  
  - letter-spacing: 0.05em  

Botones:
  - border-radius: 12px  
  - padding: 1rem 2.5rem  
  - font-size: 1.4rem  
  - font-weight: 600  
  - box-shadow: 0 4px 12px rgba(0,0,0,0.2)  
  - transition: all 0.15s ease  
  - cursor: pointer  

Layout:
  - Centrado horizontal y vertical en viewport  
  - Gap entre display y botones: 2rem  
  - Gap entre botones: 2rem  
  - Botones al mismo tamaño (min-width: 180px)  
```

---

**Estructura de archivos requerida**

`index.html` — Solo estructura y estilos. Debe:
- Cargar `script.js` con `defer`
- Definir el div del display (`#display`), el span de milisegundos (`#millis`), el botón primario (`#btn-primary`) y el botón clear (`#btn-clear`)
- Incluir todos los estilos en `<style>` interno

`script.js` — Solo lógica. Debe:
- Gestionar el estado (`STOPPED | RUNNING | PAUSED`)
- Usar `requestAnimationFrame` con acumulación precisa de tiempo
- Actualizar DOM solo cuando el valor visual cambie (optimización)
- Separar claramente las funciones: `start()`, `pause()`, `resume()`, `clear()`, `render()`

---

**Restricciones**
- Sin frameworks ni librerías externas
- Sin `setInterval` (usar exclusivamente `requestAnimationFrame`)
- El tiempo debe ser preciso incluso si la pestaña pierde foco y recupera (reanclar timestamp al retomar)
- Compatible con Chrome, Firefox y Safari modernos