import store from "../store";
import { createAddTodoAction } from "../flux/index";
import { TodoProps } from "./todo";

class TodoForm {
  button: any;
  form: any;

  constructor() {
    this.button = document.querySelector(".todo-form__submit");
    this.form = document.querySelector(".todo-form__input");
  }

  mount() {
    if(this.button==null) {
      throw new Error("Button error");
    }
    if(this.form==null) {
      throw new Error("Form error");
    }
    this.button.addEventListener("click", (e: any) => {
      e.preventDefault();
      let todo:TodoProps = { id: undefined, name: this.form.value.toString(), done: undefined};
      store.dispatch(createAddTodoAction(todo));
      this.form.value = "";
    });
  }
}

export default TodoForm;
