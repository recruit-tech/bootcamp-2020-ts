import store from "../store";
import { createAddTodoAction } from "../flux/index";
class TodoForm {
    constructor() {
        this.button = document.querySelector(".todo-form__submit");
        this.form = document.querySelector(".todo-form__input");
    }
    mount() {
        if (this.button == null) {
            throw new Error("Button error");
        }
        if (this.form == null) {
            throw new Error("Form error");
        }
        this.button.addEventListener("click", (e) => {
            e.preventDefault();
            let todo = { id: undefined, name: this.form.value.toString(), done: undefined };
            store.dispatch(createAddTodoAction(todo));
            this.form.value = "";
        });
    }
}
export default TodoForm;
