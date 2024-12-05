document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const progressBar = document.getElementById('progress-bar');
    const errorMessage = document.getElementById('error-message');
    const clearAllBtn = document.getElementById('clear-all-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateProgressBar();
    }

    function updateProgressBar() {
        const completedTodos = todos.filter(todo => todo.completed).length;
        const progress = (completedTodos / todos.length) * 100 || 0;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (todo.completed) {
                li.classList.add('completed');
            }
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                todos[index].completed = checkbox.checked;
                saveTodos();
                renderTodos();
            });

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', todo.text);
                if (newText !== null) {
                    todos[index].text = newText.trim();
                    saveTodos();
                    renderTodos();
                }
            });

            todoList.appendChild(li);
        });
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todoText = todoInput.value.trim();
        if (todoText) {
            todos.push({ text: todoText, completed: false });
            todoInput.value = '';
            errorMessage.textContent = '';
            saveTodos();
            renderTodos();
        } else {
            errorMessage.textContent = 'Please enter a task.';
        }
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    });

    renderTodos();
    updateProgressBar();
});

