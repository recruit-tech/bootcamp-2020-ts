import Todo from "./todo.js";

type TodoType = {
    id: number;
    name: string;
    done: boolean;
}
type TodoListMap = {
    todoList: TodoType[]
}
class TodoList {
    parent: Element;
    element: HTMLUListElement;
    props: TodoListMap 
    
  constructor (parent: Element,  props: TodoListMap) {
    this.parent = parent;
    this.element = document.createElement("ul");
    this.element.className = "todo-list";
    this.props =  props;
  }

  render() {
    // 二回目以降のレンダリングでは
    // 前回の DOM を破棄して 子要素すべてを rendering し直す
    if (this.parent.children.length !== 0) {
      for (const child of this.parent.children) {
        this.parent.removeChild(child);
      }
    }

    this.props.todoList.map(todo => {
      new Todo(this.element, todo).render();
    });

    this.parent.appendChild(this.element);
  }
}

export default TodoList;
