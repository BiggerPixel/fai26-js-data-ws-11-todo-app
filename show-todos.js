// Funktionen som visar todos på sidan. Vi ändrar inte i den här filen.
// Vi importerar showTodos i script.js och använder den där.

const todoList = document.querySelector("#todo-list");

// Visar todos i listan, med en kryssruta för varje todo.
// todos är en array med todos från API:t, till exempel [{ id: 1, title: "Köpa mjölk", isCompleted: false }].
// onToggle är en callback som vi behöver först i extrauppgiften.
// Den körs med todon när någon klickar på kryssrutan.
// Exempel: showTodos(todos) eller showTodos(todos, toggleTodo).
export const showTodos = (todos, onToggle) => {
  if (todos.length === 0) {
    todoList.innerHTML = `<li class="text-slate-500">Inga todos än.</li>`;
    return;
  }

  const items = todos.map((todo) => {
    let checked = "";
    let titleClasses = "";

    if (todo.isCompleted === true) {
      checked = "checked";
      titleClasses = "text-slate-400 line-through";
    }

    return `
      <li class="flex items-center gap-3 rounded bg-white p-3 shadow">
        <input id="todo-${todo.id}" type="checkbox" ${checked} class="size-5" />
        <label for="todo-${todo.id}" class="${titleClasses}">${todo.title}</label>
      </li>
    `;
  });

  todoList.innerHTML = items.join("");

  todos.forEach((todo) => {
    const checkbox = document.querySelector(`#todo-${todo.id}`);

    checkbox.addEventListener("change", () => {
      if (onToggle === undefined) {
        console.log("Kryssrutan gör ingenting än. Det fixar vi i extrauppgiften.");
        return;
      }

      onToggle(todo);
    });
  });
};
