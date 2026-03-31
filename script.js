// ========================================
// LISTA DE TAREAS EN MEMORIA (EDITABLE)
// ========================================
const tasksData = [
    { id: 1, text: 'Revisar emails', completed: false },
    { id: 2, text: 'Escribir reporte diario', completed: false },
    { id: 3, text: 'Llamada con equipo', completed: false },
    { id: 4, text: 'Actualizar documentación', completed: false },
    { id: 5, text: 'Revisar código de PR', completed: false },
    { id: 6, text: 'Planificación semanal', completed: false },
    { id: 7, text: 'Reunion con cliente', completed: false },
    { id: 8, text: 'Probar nuevas features', completed: false }
];

const TASKS_STORAGE_KEY = 'timeRulette.tasks';

function loadTasksFromStorage() {
    try {
        const raw = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!raw) {
            return [...tasksData];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [...tasksData];
        }

        return parsed
            .filter(task => task && typeof task.text === 'string')
            .map((task, index) => ({
                id: Number.isInteger(task.id) ? task.id : index + 1,
                text: task.text,
                completed: Boolean(task.completed)
            }));
    } catch {
        return [...tasksData];
    }
}

function saveTasksToStorage() {
    try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks));
    } catch {
    }
}

const initialTasks = loadTasksFromStorage();

// ========================================
// ESTADO DE LA APLICACIÓN
// ========================================
const state = {
    tasks: [...initialTasks],
    selectedTask: null,
    idCounter: Math.max(...initialTasks.map(task => task.id), 0) + 1,
    excludedTaskForNextDrawId: null
};

// ========================================
// ELEMENTES DEL DOM
// ========================================
const spinBtn = document.getElementById('spinBtn');
const rouletteScreen = document.getElementById('rouletteScreen');
const completionScreen = document.getElementById('completionScreen');
const homeScreen = document.getElementById('homeScreen');
const resetBtn = document.getElementById('resetBtn');
const tasksList = document.getElementById('tasksList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const homeTaskList = document.getElementById('homeTaskList');
const goToRouletteBtn = document.getElementById('goToRouletteBtn');
const goToHomeBtn = document.getElementById('goToHomeBtn');
const selectedTaskPanel = document.getElementById('selectedTaskPanel');
const selectedTaskName = document.getElementById('selectedTaskName');
const finishTaskBtn = document.getElementById('finishTaskBtn');
const backToRouletteBtn = document.getElementById('backToRouletteBtn');
const embedThemeToggle = document.getElementById('embedThemeToggle');

const isEmbedded = window.self !== window.top;
const EMBED_THEME_STORAGE_KEY = 'timeRulette.embedTheme';

function applyEmbedTheme(theme) {
    const darkEnabled = theme === 'dark';
    document.body.classList.toggle('embed-dark', darkEnabled);
    document.documentElement.classList.toggle('embed-dark', darkEnabled);

    if (embedThemeToggle) {
        embedThemeToggle.textContent = darkEnabled ? '☀' : '☾';
        embedThemeToggle.setAttribute('aria-label', darkEnabled ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
        embedThemeToggle.setAttribute('title', darkEnabled ? 'Tema claro' : 'Tema oscuro');
    }
}

if (isEmbedded) {
    document.documentElement.classList.add('embed-clean', 'embed-mini');
    document.body.classList.add('embed-clean');
    document.body.classList.add('embed-mini');

    const storedTheme = localStorage.getItem(EMBED_THEME_STORAGE_KEY);
    applyEmbedTheme(storedTheme === 'dark' ? 'dark' : 'light');

    if (embedThemeToggle) {
        embedThemeToggle.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('embed-dark') ? 'light' : 'dark';
            applyEmbedTheme(nextTheme);
            localStorage.setItem(EMBED_THEME_STORAGE_KEY, nextTheme);
        });
    }
}

// ========================================
// FUNCIONES PRINCIPALES
// ========================================

/**
 * Obtiene todas las tareas no completadas
 */
function getPendingTasks() {
    return state.tasks.filter(task => !task.completed);
}

/**
 * Verifica si todas las tareas están completadas
 */
function allTasksCompleted() {
    return state.tasks.length > 0 && getPendingTasks().length === 0;
}

/**
 * Selecciona una tarea aleatoria de las pendientes
 */
function selectRandomTask() {
    const pending = getPendingTasks();
    
    if (pending.length === 0) {
        showCompletionScreen();
        return null;
    }

    const excludedTaskId = state.excludedTaskForNextDrawId;
    state.excludedTaskForNextDrawId = null;

    let candidates = pending;
    if (excludedTaskId !== null) {
        const filtered = pending.filter(task => task.id !== excludedTaskId);
        if (filtered.length > 0) {
            candidates = filtered;
        }
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
}

/**
 * Maneja el clic del botón de ruleta
 */
function onSpinClick() {
    const selected = selectRandomTask();
    
    if (selected) {
        state.selectedTask = selected;
        showSelectedTaskPanel(selected);
    }
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        return;
    }

    state.tasks.push({
        id: state.idCounter++,
        text: taskText,
        completed: false
    });

    taskInput.value = '';
    saveTasksToStorage();
    renderTasks();
    renderHomeTasks();
    updateStats();
    updateButtonState();
}

function deleteTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    if (state.selectedTask && state.selectedTask.id === taskId) {
        state.selectedTask = null;
        hideSelectedTaskPanel();
    }
    saveTasksToStorage();
    renderTasks();
    renderHomeTasks();
    updateStats();
    updateButtonState();
}

/**
 * Marca una tarea como completada/no completada
 */
function toggleTaskComplete(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        renderHomeTasks();
        updateStats();
        updateButtonState();
        
        if (allTasksCompleted()) {
            setTimeout(showCompletionScreen, 300);
        }
    }
}

/**
 * Renderiza la lista de tareas en la barra lateral
 */
function renderTasks() {
    tasksList.innerHTML = '';

    if (state.tasks.length === 0) {
        tasksList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Sin tareas</p>';
        return;
    }

    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                data-task-id="${task.id}"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

        tasksList.appendChild(li);
    });
}

function renderHomeTasks() {
    homeTaskList.innerHTML = '';

    if (state.tasks.length === 0) {
        homeTaskList.innerHTML = '<li class="home-task-item"><span class="home-task-text">No hay tareas.</span></li>';
        return;
    }

    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `home-task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="home-task-main">
                <span class="home-task-marker" aria-hidden="true">❤</span>
                <span class="home-task-text">${escapeHtml(task.text)}</span>
            </div>
            <button class="delete-btn" data-delete-id="${task.id}" aria-label="Eliminar tarea">
                <span class="delete-btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false">
                        <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9zm1 12h8a2 2 0 0 0 2-2V9H6v10a2 2 0 0 0 2 2z"/>
                    </svg>
                </span>
                <span class="delete-btn-text">Eliminar</span>
            </button>
        `;

        const deleteButton = li.querySelector('.delete-btn');

        deleteButton.addEventListener('click', () => deleteTask(task.id));

        homeTaskList.appendChild(li);
    });
}

/**
 * Actualiza las estadísticas (tareas pendientes y completadas)
 */
function updateStats() {
    const pending = getPendingTasks().length;
    const completed = state.tasks.length - pending;

    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

/**
 * Actualiza el estado del botón spinner
 */
function updateButtonState() {
    const pending = getPendingTasks();
    spinBtn.disabled = pending.length === 0;
}

/**
 * Muestra la pantalla de finalización
 */
function showCompletionScreen() {
    homeScreen.classList.add('hidden');
    rouletteScreen.classList.add('hidden');
    completionScreen.classList.remove('hidden');
}

/**
 * Vuelve a la pantalla de ruleta
 */
function resetToRoulette() {
    state.tasks = [];
    state.selectedTask = null;
    state.excludedTaskForNextDrawId = null;

    saveTasksToStorage();

    renderTasks();
    renderHomeTasks();
    updateStats();
    updateButtonState();

    homeScreen.classList.remove('hidden');
    rouletteScreen.classList.add('hidden');
    completionScreen.classList.add('hidden');
    hideSelectedTaskPanel();
}

function showHomeScreen() {
    homeScreen.classList.remove('hidden');
    rouletteScreen.classList.add('hidden');
    completionScreen.classList.add('hidden');
    hideSelectedTaskPanel();
}

function showRouletteScreen() {
    homeScreen.classList.add('hidden');
    rouletteScreen.classList.remove('hidden');
    completionScreen.classList.add('hidden');
    hideSelectedTaskPanel();
}

function showSelectedTaskPanel(task) {
    spinBtn.classList.add('hidden');
    selectedTaskName.textContent = task.text;
    selectedTaskPanel.classList.remove('hidden');
}

function hideSelectedTaskPanel() {
    spinBtn.classList.remove('hidden');
    selectedTaskPanel.classList.add('hidden');
    selectedTaskName.textContent = '';
}

function finishSelectedTask() {
    if (!state.selectedTask) {
        return;
    }

    const task = state.tasks.find(item => item.id === state.selectedTask.id);
    if (task) {
        task.completed = true;
    }

    state.selectedTask = null;
    state.excludedTaskForNextDrawId = null;
    saveTasksToStorage();
    hideSelectedTaskPanel();
    renderTasks();
    renderHomeTasks();
    updateStats();
    updateButtonState();

    if (allTasksCompleted()) {
        setTimeout(showCompletionScreen, 300);
    }
}

function backFromSelectedTask() {
    if (!state.selectedTask) {
        hideSelectedTaskPanel();
        return;
    }

    state.excludedTaskForNextDrawId = state.selectedTask.id;
    state.selectedTask = null;
    hideSelectedTaskPanel();
}

/**
 * Escapa caracteres HTML para evitar XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// EVENT LISTENERS
// ========================================
spinBtn.addEventListener('click', onSpinClick);
resetBtn.addEventListener('click', resetToRoulette);
goToRouletteBtn.addEventListener('click', showRouletteScreen);
goToHomeBtn.addEventListener('click', showHomeScreen);
addTaskBtn.addEventListener('click', addTask);
finishTaskBtn.addEventListener('click', finishSelectedTask);
backToRouletteBtn.addEventListener('click', backFromSelectedTask);
taskInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================
renderTasks();
renderHomeTasks();
updateStats();
updateButtonState();
showHomeScreen();