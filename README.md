# 🎡 Ruleta de Tareas - Notion Widget

Widget en frontend puro (HTML/CSS/JS) para gestionar tareas y seleccionar una pendiente al azar.

## ✨ Estado actual del proyecto

- Arquitectura separada en 3 archivos: `index.html`, `style.css`, `script.js`.
- Diseño pastel/kawaii con versión embed compacta para iframes (como Notion).
- Flujo completo por pantallas: gestión → ruleta → final.
- Persistencia local en `localStorage` para mantener tareas entre recargas.

## 🧩 Pantallas y funcionamiento

### 1) Pantalla principal (Gestión)

- Añadir tarea desde input + botón `Añadir` (también con Enter).
- Eliminar tarea desde botón `Eliminar`.
- Lista de tareas con icono de corazón como marcador visual de cada tarea.
- Botón `Ir a la ruleta` para pasar a la selección aleatoria.
- **La barra lateral está oculta en esta pantalla.**

#### Vista normal (no compacta)

- Cada tarea se muestra como tarjeta independiente.
- La lista se ve separada por elementos individuales.

#### Comportamiento compacto (pantalla pequeña y embed)

- `Input + Añadir` en una sola línea.
- Botón `Añadir` en formato icono.
- Lista de tareas en una sola caja (filas), no tarjetas independientes.
- Menor interlineado y densidad más compacta en cada fila.
- Cada fila muestra: corazón + texto + botón eliminar con icono.
- En embed compacto, la caja de tareas tiene scroll interno para listas largas.

### 2) Pantalla de ruleta

- Botón circular `ELEGIR` selecciona una tarea pendiente aleatoria.
- Se muestra panel de tarea seleccionada con:
  - `Terminar`: marca la tarea como completada y vuelve a ruleta.
  - `Volver`: no la completa y vuelve a ruleta.
- Regla de exclusión: al pulsar `Volver`, esa tarea se excluye **solo en el siguiente sorteo**.
- **La barra lateral sí se muestra en esta pantalla.**

### 3) Pantalla final (`¡Lo hiciste!`)

- Aparece cuando todas las tareas están completadas.
- Botón `Reiniciar` para volver a gestión y dejar la lista vacía.
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
- En pantalla pequeña (`max-width: 768px`) el modo no embebido usa comportamiento compacto, equivalente al modo embed.

## 🌐 Modo embed (Notion)

El proyecto incluye un modo automático para embeds, si se carga dentro de `iframe`, se activa automáticamente.

### ¿Qué cambia en el modo embed?

- Fondo externo transparente.
- Composición `full-bleed` (el widget ocupa todo el iframe).
- Menos sombras y decoración.
- Flores decorativas ocultas.
- Toggle de tema en la esquina superior derecha (`☾ / ☀`) para alternar claro/oscuro.
- En modo oscuro embed, el fondo del widget pasa a `#191919`.
- Proporciones más reducidas (fuentes, ruleta, botones, paddings y paneles).
- Barra lateral oculta para ahorrar espacio.
- Pantalla de gestión en formato lista compacta con controles en una línea.
- Sin scroll externo del iframe (solo scroll interno en la lista de tareas compacta).

## ⚙️ Configuración rápida

### Editar tareas iniciales

En `script.js`:

```javascript
const tasksData = [
  { id: 1, text: 'Revisar emails', completed: false },
  { id: 2, text: 'Escribir reporte diario', completed: false }
];
```

Notas:

- `tasksData` se usa como lista inicial cuando no hay datos guardados.
- Tras el primer uso, las tareas se guardan automáticamente en `localStorage`.
- La preferencia de tema del toggle embed (claro/oscuro) también se guarda en `localStorage`.
- El botón `Reiniciar` en la pantalla final vacía la lista y actualiza `localStorage`.

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
