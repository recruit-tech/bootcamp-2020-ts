import store from "../store.js";
import { createAddTodoAction } from "../flux/index.js";

class TodoForm {
  button: HTMLInputElement
  form: HTMLInputElement
  constructor() {
    const button = document.querySelector(".todo-form__submit")
    if(!button) throw new Error("")
    this.button = button as HTMLInputElement
    const form = document.querySelector(".todo-form__input");
    if(!form) throw new Error("")
    this.form = form as HTMLInputElement

  }

  mount() {
    if(!this.button){
      throw new Error("button erro")
    }
    else {
      this.button.addEventListener("click", e => {
        e.preventDefault();
        if(!this.form){
          throw new Error("hogehoge")
        }
        else{
          store.dispatch(createAddTodoAction({ name: this.form.value }));
          this.form.value = "";
        }
    });
  }}
}

export default TodoForm;
