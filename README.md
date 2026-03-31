# 🎡 Ruleta de Tareas - Notion Widget

Widget en frontend puro (HTML/CSS/JS) para gestionar tareas y seleccionar una pendiente al azar.

## ✨ Estado actual del proyecto

- Arquitectura separada en 3 archivos: `index.html`, `style.css`, `script.js`.
- Diseño pastel/kawaii con versión embed clean para iframes (Notion).
- Flujo completo por pantallas: gestión → ruleta → final.

## 🧩 Pantallas y funcionamiento

### 1) Pantalla principal (Gestión)

- Añadir tarea desde input + botón `Añadir` (también con Enter).
- Eliminar tarea desde botón `Eliminar`.
- En pantallas muy pequeñas, el botón `Eliminar` se convierte en icono de papelera.
- Botón `Ir a la ruleta` para pasar a la selección aleatoria.
- **La barra lateral está oculta en esta pantalla.**

### 2) Pantalla de ruleta

- Botón circular `ELEGIR` selecciona una tarea pendiente aleatoria.
- Ya no se usa popup/alert.
- Se muestra panel de tarea seleccionada con:
  - `Terminar`: marca la tarea como completada y vuelve a ruleta.
  - `Volver`: no la completa y vuelve a ruleta.
- Regla de exclusión: al pulsar `Volver`, esa tarea se excluye **solo en el siguiente sorteo**.
- **La barra lateral sí se muestra en esta pantalla.**

### 3) Pantalla final (`¡Lo hiciste!`)

- Aparece cuando todas las tareas están completadas.
- Botón `Reiniciar` para volver a la ruleta.
- **La barra lateral está oculta en esta pantalla.**

## 📌 Barra lateral

- Muestra lista de tareas con checkbox de completado.
- Las tareas completadas aparecen tachadas.
- Visibilidad actual:
  - Oculta en gestión.
  - Visible en ruleta.
  - Oculta en pantalla final.

## 📱 Responsive y comportamiento móvil

- Layout adaptable en desktop y móvil.
- En móvil pequeño (`max-width: 480px`), los botones de eliminar pasan a icono.

## 🌐 Modo embed (Notion)

El proyecto incluye un modo automático para embeds:

- Si se carga dentro de `iframe`, se activa `embed-clean`.
- También puede forzarse con query param: `?embed=clean`.

### ¿Qué cambia en `embed-clean`?

- Fondo externo transparente.
- Menos sombras y decoración.
- Flores decorativas ocultas.
- Proporciones reducidas del widget (ruleta, textos, paddings, sidebar y tarjetas).

## ⚙️ Configuración rápida

### Editar tareas iniciales

En `script.js`:

```javascript
const tasksData = [
  { id: 1, text: 'Revisar emails', completed: false },
  { id: 2, text: 'Escribir reporte diario', completed: false }
];
```

## 🗂️ Estructura del proyecto

```
timeRulette/
├── index.html   # Estructura de pantallas
├── style.css    # Tema, responsive y modo embed
├── script.js    # Estado, lógica de flujo y eventos
└── README.md
```

## 🚀 Publicación en GitHub Pages

- Repo: `https://github.com/MartaGD/time-roulette-widget`
- URL Pages: `https://martagd.github.io/time-roulette-widget/`

Para Notion, usa `/embed` con la URL de Pages.

---

## 🔮 Futuras implementaciones

### Temporizador por tarea ⏱️

Después de seleccionar tarea:

- Botón `Empezar`
- Botón `Pausar`
- Botón `Terminar`
- Contador de tiempo invertido
- Guardado del tiempo de ejecución (almacenamiento por decidir)

Posibles opciones de almacenamiento:

- `localStorage` (rápido para empezar)
- `IndexedDB` (más robusto)
- Backend/API (si se añade servidor)

---

## 📄 Licencia

Libre para uso y modificación.
