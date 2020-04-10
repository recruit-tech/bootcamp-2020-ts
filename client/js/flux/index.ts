/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber: (event: Event) => void) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */
const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";
const ADD_TODO_ACTION_TYPE = "A todo addition to store";
const UPDATE_TODO_ACTION_TYPE = "Update todo state";
const REMOVE_TODO_ACTION_TYPE = "Remove todo";
const CLEAR_ERROR = "Clear error from state";
type FetchAction = {
  type: typeof FETCH_TODO_ACTION_TYPE;
  payload: undefined;
}
type Todo = {
  id: number;
  name: string;
  done: boolean;
}
export const createFetchTodoListAction: ()=>FetchAction= () => {
  return({
    type: FETCH_TODO_ACTION_TYPE,
    payload: undefined
  })
};

type CreateAction = {
  type: typeof ADD_TODO_ACTION_TYPE;
  payload: {name: string} 
}
export const createAddTodoAction: (todo: {name: string})=>CreateAction = todo => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: todo
});
type UpdateAction = {
  type: typeof UPDATE_TODO_ACTION_TYPE;
  payload:Todo 
}
export const updateTodoAction:(todo: Todo)=>UpdateAction = todo => ({
  type: UPDATE_TODO_ACTION_TYPE,
  payload: todo
});
type RemoveAction = {
  type: typeof REMOVE_TODO_ACTION_TYPE;
  payload: Todo
}
export const removeTodoAction: (todo: Todo)=>RemoveAction = todo => ({
  type: REMOVE_TODO_ACTION_TYPE,
  payload: todo
});
type ClearAction = {
  type: typeof CLEAR_ERROR;
  payload: undefined
}
export const clearError: ()=>ClearAction = () => ({
  type: CLEAR_ERROR,
  payload: undefined
});

/**
 * Store Creator
 */
const api = "http://localhost:3000/todo";

const defaultState = {
  todoList: [],
  error: undefined 
};

const headers = {
  "Content-Type": "application/json; charset=utf-8"
};
type GeneralAction = FetchAction | CreateAction | UpdateAction |RemoveAction| ClearAction 
type State = {
  todoList: Todo[];
  error?: any;
}
const reducer:(prevState:State, action: GeneralAction)=>any = async (prevState, action) => {
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
        const idx = prevState.todoList.findIndex(todo => todo.id === resp.id);
        if (idx === -1) return prevState;
        const nextTodoList = prevState.todoList.concat();
        nextTodoList[idx] = resp;
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case REMOVE_TODO_ACTION_TYPE: {
      const { id } = action.payload;
      try {
        await fetch(`${api}/${id}`, {
          method: "DELETE",
          mode: "cors"
        });
        const idx = prevState.todoList.findIndex(todo => todo.id == id);
        if (idx === -1) return prevState;
        const nextTodoList = prevState.todoList.concat();
        nextTodoList.splice(idx, 1);
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case ADD_TODO_ACTION_TYPE: {
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
      throw new Error("unexpected action type" );
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async (action:GeneralAction) => {
    console.group(action.type);
    console.log("prev", state);
    state = await reducer(state, action);
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber: (state:State)=>void) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe
  };
}
