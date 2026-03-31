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

// ========================================
// ESTADO DE LA APLICACIÓN
// ========================================
const state = {
    tasks: [...tasksData],
    selectedTask: null,
    idCounter: Math.max(...tasksData.map(task => task.id), 0) + 1,
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
        renderTasks();
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
            <span class="home-task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" data-delete-id="${task.id}">Eliminar</button>
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
    homeScreen.classList.add('hidden');
    rouletteScreen.classList.remove('hidden');
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