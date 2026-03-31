# 🎡 Ruleta de Tareas - Widget Notion

Una aplicación web interactiva para gestionar tareas mediante una ruleta aleatoria. Perfecta para cuando no sabes qué tarea hacer primero.

## 📋 Descripción de la Aplicación

**Ruleta de Tareas** es un widget de frontend puro que te ayuda a elegir tareas de forma aleatoria. La aplicación utiliza una interfaz intuitiva con un gran botón circular en el centro y una lista de tareas en la barra lateral.

### Funcionalidades Principales

- **🎯 Selección Aleatoria**: Presiona el botón "ELEGIR" para que la aplicación seleccione una tarea aleatoria de las pendientes
- **📝 Lista de Tareas**: Visualiza todas tus tareas en la barra lateral
- **✅ Marcar Completadas**: Usa los checkboxes para marcar tareas como completadas
- **🎨 Indicadores Visuales**: Las tareas completadas aparecen tachadas y con estilo diferente
- **📊 Estadísticas en Tiempo Real**: Muestra el número de tareas pendientes y completadas
- **🎉 Pantalla de Finalización**: Cuando completas todas las tareas, aparece una pantalla de celebración
- **💾 100% Frontend**: Todo funciona en el navegador sin necesidad de servidor

## 🚀 Cómo Iniciar

1. Abre el archivo `index.html` en tu navegador web
2. La aplicación cargará automáticamente con una lista predefinida de tareas

## 🎮 Cómo Usar

### Pantalla Principal
- **Botón Circular (ELEGIR)**: Presiona para seleccionar aleatoriamente una tarea pendiente
- Una vez seleccionada, aparecerá un alert con la tarea elegida
- **Contador Pendientes/Completadas**: Aparece bajo el botón para seguimiento rápido

### Barra Lateral - Gestión de Tareas
- **Checkbox**: Marca una tarea como completada haciendo clic en el checkbox
- **Lista Scrolleable**: Si hay muchas tareas, puedes desplazarte con la rueda del ratón
- Las tareas completadas aparecen con una línea a través (tachadas)

### Pantalla Final
- Cuando todas las tareas estén completadas, aparece la pantalla de celebración
- Presiona el botón "Reiniciar" para volver a la pantalla principal y continuar

## ⚙️ Configuración

### Editar la Lista de Tareas

Para cambiar las tareas predefinidas, abre `index.html` en un editor de texto y busca esta sección:

```javascript
const tasksData = [
    { id: 1, text: 'Revisar emails', completed: false },
    { id: 2, text: 'Escribir reporte diario', completed: false },
    { id: 3, text: 'Llamada con equipo', completed: false },
    // ... más tareas
];
```

Modifica el array con tus propias tareas:
- `id`: Identificador único (número)
- `text`: Descripción de la tarea
- `completed`: Estado inicial (true/false)

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y animaciones modernas
- **JavaScript Vanilla**: Lógica sin dependencias externas
- **Responsive Design**: Compatible con dispositivos móviles

## 📱 Responsive

La aplicación se adapta automáticamente a diferentes tamaños de pantalla:
- **Desktop**: Layout horizontal (ruleta + barra lateral)
- **Tablet/Mobile**: Layout vertical (ruleta arriba, tareas abajo)

## 🏗️ Estructura del Código

```
index.html
├── Estilos CSS
├── HTML (estructura)
└── JavaScript
    ├── Estado de la aplicación (tasksData)
    ├── Funciones principales
    │   ├── getPendingTasks() - Obtiene tareas pendientes
    │   ├── selectRandomTask() - Selecciona una aleatoria
    │   ├── toggleTaskComplete() - Marca/desmarca tareas
    │   ├── renderTasks() - Renderiza la lista
    │   ├── updateStats() - Actualiza estadísticas
    │   └── showCompletionScreen() - Muestra pantalla final
    └── Event Listeners
```

## 🎯 Flujo de la Aplicación

```
1. Inicio
   ↓
2. Mostrar lista de tareas pendientes
   ↓
3. Usuario presiona "ELEGIR"
   ↓
4. Seleccionar tarea aleatoria
   ↓
5. Mostrar alert con la tarea
   ↓
6. Usuario marca tareas como completadas
   ↓
7. ¿Todas completadas?
   ├─ No → Volver al paso 3
   └─ Sí → Mostrar pantalla de celebración
```

---

## 🔮 Futuras Implementaciones

### 1. **Temporizador Integrado** ⏱️

#### Descripción
Después de seleccionar una tarea, el usuario podrá iniciar un temporizador para controlar cuánto tiempo tarda en completarla. El temporizador incluirá:

- **Botón "Empezar"**: Inicia la cuenta regresiva/contador
- **Botón "Pausar"**: Pausa temporalmente el temporizador
- **Botón "Terminar"**: Detiene el temporizador y registra el tiempo

#### Características Propuestas
- Mostrar tiempo transcurrido en formato MM:SS
- Registrar tiempo en la estructura de datos de cada tarea
- Historial de tiempos por tarea (tiempo mínimo, máximo, promedio)
- Visualizar el tiempo registrado junto a cada tarea
- Notificación sonora opcional al terminar

#### Almacenamiento de Datos
Se puede implementar de varias formas:

**Opción 1: LocalStorage (Recomendado para inicio)**
```javascript
// Guardar en navegador (persiste entre sesiones)
localStorage.setItem('tasksTimeData', JSON.stringify(timeRecords));
```

**Opción 2: IndexedDB (Para datos más complejos)**
```javascript
// Base de datos en navegador más potente
const request = indexedDB.open('TasksDB', 1);
```

**Opción 3: Backend API**
```javascript
// Enviar a servidor (requiere backend)
fetch('/api/task-times', {
    method: 'POST',
    body: JSON.stringify(timeData)
});
```

**Opción 4: Exportar/Importar JSON**
```javascript
// Permitir descargar datos como archivo JSON
const dataUrl = 'data:application/json,' + JSON.stringify(allData);
// También permitir cargar desde archivo
```

#### Datos a Almacenar
```javascript
{
    taskId: 1,
    taskText: 'Revisar emails',
    completionTime: 450, // segundos
    timestamp: '2026-03-31T14:30:00Z',
    status: 'completed'
}
```

---

### 2. **Estadísticas Avanzadas** 📊

- Dashboard con gráficos de tiempo por tarea
- Productividad diaria/semanal/mensual
- Tareas más rápidas/lentas
- Historial completo de sesiones

### 3. **Sincronización con Notion** 🔗

- Integración con API de Notion
- Sincronizar tareas desde Notion
- Actualizar estados automáticamente

### 4. **Sonidos y Notificaciones** 🔔

- Sonido al seleccionar tarea
- Notificación cuando se completa una tarea
- Alarma al terminar el temporizador

### 5. **Temas Personalizables** 🎨

- Modo oscuro/claro
- Selector de colores
- Guardad preferencias del usuario

### 6. **Categorías y Filtrado** 🏷️

- Agrupar tareas por categoría
- Filtrar por prioridad
- Vistas personalizadas

### 7. **Importar/Exportar** 💾

- Exportar tareas a CSV/JSON
- Importar desde archivos
- Respaldar datos

---

## 📄 Licencia

Libre para usar y modificar

## 👤 Autor

Creado para optimizar la productividad mediante selección aleatoria de tareas
