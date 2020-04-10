import store from "../store.js";
import { updateTodoAction, removeTodoAction } from "../flux/index.js";

type todo = {
    id: number,
    name: string,
    done: boolean
}
class Todo {
   parent: Element;
   element: HTMLLIElement;
   props: todo ;
   mounted: boolean;
  constructor(parent: Element, todo: todo) {
    this.parent = parent;
    this.element = document.createElement("li");
    this.element.className = "todo-item";
    this.props = todo;
    this.mounted = false;
  }

  mount() {
    if (this.mounted) return;
    const toggle = this.element.querySelector(".todo-toggle");
    if (!toggle) throw new Error("toggle ")
    toggle.addEventListener("click", () => {
      this.props.done = !this.props.done;
      store.dispatch(updateTodoAction(this.props));
    });
    const removeButton = this.element.querySelector(".todo-remove-button");
    if (!removeButton) throw new Error("toggle ")
    removeButton.addEventListener("click", () => {
      store.dispatch(removeTodoAction(this.props));
    });
    this.mounted = true;
  }

  render() {
    const { id, name, done } = this.props;
    this.element.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done ? "checked" : ""}
        />
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${name}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `;
    this.parent.appendChild(this.element);
    this.mount();
  }
}

export default Todo;
