import Todo, { TodoProps } from "../components/todo";

/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber: any) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */

type Action = {
  type: string,
  payload: TodoProps | undefined
};

const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";
export const createFetchTodoListAction = () => ({
  type: FETCH_TODO_ACTION_TYPE,
  paylaod: undefined
});

const ADD_TODO_ACTION_TYPE = "A todo addition to store";
export const createAddTodoAction = (todo: TodoProps) => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: todo
});

const UPDATE_TODO_ACTION_TYPE = "Update todo state";
export const updateTodoAction = (todo: TodoProps) => ({
  type: UPDATE_TODO_ACTION_TYPE,
  payload: todo
});

const REMOVE_TODO_ACTION_TYPE = "Remove todo";
export const removeTodoAction = (todo: TodoProps) => ({
  type: REMOVE_TODO_ACTION_TYPE,
  payload: todo
});

const CLEAR_ERROR = "Clear error from state";
export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: undefined
});

/**
 * Store Creator
 */
const api = "http://localhost:3000/todo";

const defaultState = {
  todoList: [],
  error: null
};

const headers = {
  "Content-Type": "application/json; charset=utf-8"
};

const reducer = async (prevState: any, action: Action) => {
  switch (action.type) {
    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then(d => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case UPDATE_TODO_ACTION_TYPE: {
      if(action.payload==null) {
        console.log("payloadがnullです");
        return;
      }
      const { id, ...body } = action.payload;
      try {
        const resp = await fetch(`${api}/${id}`, {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(body)
        }).then(d => d.json());
        const idx = prevState.todoList.findIndex((todo: TodoProps) => todo.id === resp.id);
        if (idx === -1) return prevState;
        const nextTodoList = prevState.todoList.concat();
        nextTodoList[idx] = resp;
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case REMOVE_TODO_ACTION_TYPE: {
      if(action.payload==null) {
        console.log("payloadがnullです");
        return;
      }
      const id = action.payload.id;
      try {
        await fetch(`${api}/${id}`, {
          method: "DELETE",
          mode: "cors"
        });
        const idx = prevState.todoList.findIndex((todo: TodoProps) => todo.id == id);
        if (idx === -1) return prevState;
        const nextTodoList = prevState.todoList.concat();
        nextTodoList.splice(idx, 1);
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case ADD_TODO_ACTION_TYPE: {
      if(action.payload==null) {
        console.log("payloadがnullです");
        return;
      }
      const body = JSON.stringify(action.payload);
      const config = { method: "POST", body, headers };
      try {
        const resp = await fetch(api, config).then(d => d.json());
        return { todoList: [...prevState.todoList, resp], error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error("unexpected action type");
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async (action: Action) => {
    console.group(action.type);
    console.log("prev", state);
    state = await reducer(state, action);
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber: any) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe
  };
}
