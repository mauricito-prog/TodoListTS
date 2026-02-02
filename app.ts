// ============================================
// DEFINIÇÃO DE TIPOS (Interface)
// ============================================

// Interface define a "forma" de um objeto
// É como um contrato: toda tarefa DEVE ter id, text e completed
interface Task {
    id: number;           // Identificador único
    text: string;         // Texto da tarefa
    completed: boolean;   // Se está concluída ou não
}


// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

// Array que armazena todas as tarefas
// O ": Task[]" significa "array de objetos do tipo Task"
let tasks: Task[] = [];

// Contador para gerar IDs únicos
let nextId: number = 1;


// ============================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ============================================

// Pegamos os elementos HTML que vamos manipular
// O "as HTMLInputElement" diz ao TypeScript o tipo exato do elemento
const taskInput = document.getElementById('taskInput') as HTMLInputElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const taskList = document.getElementById('taskList') as HTMLUListElement;


// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Carrega as tarefas salvas no localStorage quando a página abre
 */
function loadTasks(): void {
    // localStorage.getItem busca dados salvos
    const savedTasks = localStorage.getItem('tasks');

    // Se existem tarefas salvas
    if (savedTasks) {
        // JSON.parse converte texto de volta para array de objetos
        tasks = JSON.parse(savedTasks);

        // Atualiza o nextId para não repetir IDs
        if (tasks.length > 0) {
            nextId = Math.max(...tasks.map(t => t.id)) + 1;
        }

        // Renderiza as tarefas na tela
        renderTasks();
    }
}


/**
 * Salva as tarefas no localStorage
 */
function saveTasks(): void {
    // JSON.stringify converte o array em texto
    // localStorage.setItem salva no navegador
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Adiciona uma nova tarefa
 */
function addTask(): void {
    // Pega o texto digitado e remove espaços extras
    const text = taskInput.value.trim();

    // Se o texto estiver vazio, não faz nada
    if (text === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // Cria um novo objeto tarefa
    const newTask: Task = {
        id: nextId++,           // Usa o ID atual e incrementa
        text: text,
        completed: false        // Começa não concluída
    };

    // Adiciona ao array
    tasks.push(newTask);

    // Limpa o input
    taskInput.value = '';

    // Salva no localStorage
    saveTasks();

    // Atualiza a tela
    renderTasks();
}


/**
 * Marca/desmarca uma tarefa como concluída
 */
function toggleTask(id: number): void {
    // Procura a tarefa pelo ID
    const task = tasks.find(t => t.id === id);

    // Se encontrou, inverte o estado
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}


/**
 * Exclui uma tarefa
 */
function deleteTask(id: number): void {
    // Filtra o array, removendo a tarefa com esse ID
    tasks = tasks.filter(t => t.id !== id);

    saveTasks();
    renderTasks();
}


/**
 * Renderiza (desenha) todas as tarefas na tela
 */
function renderTasks(): void {
    // Limpa a lista atual
    taskList.innerHTML = '';

    // Para cada tarefa no array
    tasks.forEach(task => {
        // Cria um <li>
        const li = document.createElement('li');
        li.className = 'task-item';

        // Se estiver concluída, adiciona a classe "completed"
        if (task.completed) {
            li.classList.add('completed');
        }

        // Cria o checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;

        // Quando clicar no checkbox, marca/desmarca
        checkbox.addEventListener('click', () => toggleTask(task.id));

        // Cria o texto da tarefa
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        // Cria o botão de excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Excluir';

        // Quando clicar, exclui a tarefa
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Monta o <li> com todos os elementos
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        // Adiciona o <li> à lista
        taskList.appendChild(li);
    });
}


// ============================================
// EVENTOS
// ============================================

// Quando clicar no botão "Adicionar"
addBtn.addEventListener('click', addTask);

// Quando pressionar Enter no input
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Quando a página carregar, carrega as tarefas salvas
loadTasks();
