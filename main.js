window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const deadlineInput = document.querySelector(".deadline");
  const list_el = document.querySelector("#tasks");

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    list_el.innerHTML = '';

    tasks.forEach(task => {
      const task_el = createTaskElement(task);
      list_el.appendChild(task_el);
    });
  }

  function createTaskElement(task) {
    const task_el = document.createElement('div');
    task_el.classList.add('task');

    const task_content_el = document.createElement('div');
    task_content_el.classList.add('content');

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement('input');
    task_input_el.classList.add('text');
    task_input_el.type = 'text';
    task_input_el.value = task.text;
    task_input_el.setAttribute('readonly', 'readonly');

    const task_deadline_el = document.createElement('div');
    task_deadline_el.classList.add('deadline');
    task_deadline_el.textContent = `Deadline: ${task.deadline}`;

    task_content_el.appendChild(task_input_el);
    task_content_el.appendChild(task_deadline_el);

    const task_actions_el = document.createElement('div');
    task_actions_el.classList.add('actions');

    const task_edit_el = document.createElement('button');
    task_edit_el.classList.add('edit');
    task_edit_el.innerHTML = 'Edit';

    const task_delete_el = document.createElement('button');
    task_delete_el.classList.add('delete');
    task_delete_el.innerHTML = 'Delete';

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    task_edit_el.addEventListener('click', () => {
      if (task_edit_el.innerText.toLowerCase() === "edit") {
        task_edit_el.innerText = "Save";
        task_input_el.removeAttribute("readonly");
        task_input_el.focus();
      } else {
        task_edit_el.innerText = "Edit";
        task_input_el.setAttribute("readonly", "readonly");
        const newTask = task_input_el.value;
        const index = tasks.findIndex(t => t.text === task.text && t.deadline === task.deadline);
        if (index !== -1) {
          tasks[index].text = newTask;
          saveTasksToLocalStorage();
        }
      }
    });

    task_delete_el.addEventListener('click', () => {
      list_el.removeChild(task_el);
      tasks = tasks.filter(t => t.text !== task.text && t.deadline !== task.deadline);
      saveTasksToLocalStorage();
    });

    return task_el;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = input.value.trim();
    const deadline = deadlineInput.value.trim();

    if (task !== '') {
      const newTask = { text: task, deadline: deadline };
      tasks.push(newTask);
      const task_el = createTaskElement(newTask);
      list_el.appendChild(task_el);
      input.value = '';
      deadlineInput.value = '';
      saveTasksToLocalStorage();
    }
  });

  renderTasks();
});
