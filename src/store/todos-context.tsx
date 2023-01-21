import React, { useContext } from "react";
import useCloud from "../hooks/useCloud";
import useStorage from "../hooks/useStorage";
import TodoModel, { sortTodoModels } from "../models/todo";
import * as Dates from "../util/dates";
import { AuthContext } from "./auth-context";

type TodosContextType = {
    todos: TodoModel[];
    todosProcessing: boolean,
    addTodo: (todo: TodoModel) => void;
    deleteTodo: (todo: TodoModel) => void;
    undoTodo: (todo: TodoModel) => void;
    replaceTodo: (todo: TodoModel) => void;
    checkTodo: (action: string, todo: TodoModel) => void;
};

export const TodosContext = React.createContext<TodosContextType>({
    todos: [],
    todosProcessing: true,
    addTodo: (todo: TodoModel) => { },
    deleteTodo: (todo: TodoModel) => { },
    undoTodo: (todo: TodoModel) => { },
    replaceTodo: (todo: TodoModel) => { },
    checkTodo: (action: string, todo: TodoModel) => { }
});

const emptyList: TodoModel[] = [];

const TodosContextProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
    const { user, authProcessing } = useContext(AuthContext);
    const todosDbPath = user ? 'users/' + user.uid + '/todos' : undefined;
    const [cloudTodos, setCloudTodos] = useCloud<TodoModel[]>(emptyList, todosDbPath);
    const [deviceTodos, setDeviceTodos] = useStorage<TodoModel[]>(emptyList, "todo");
    const processing = authProcessing || cloudTodos.status === 'processing';

    const addTodoHandler = (newTodo: TodoModel) => {
        if (newTodo.source === 'Device') {
            setDeviceTodos(prevTodos => [newTodo, ...prevTodos]);
        }
        else {
            setCloudTodos(prevTodos => [newTodo, ...prevTodos]);
        }
    };

    const undoTodoHandler = (todo: TodoModel) => {
        todo.lastDone = todo.lastLastDone;
        if (todo.repeat) {
            todo.count--;
        }
        else {
            todo.count++;
        }
        if (todo.source === 'Device') {
            setDeviceTodos(prevTodos => [...prevTodos]);
        }
        else {
            setCloudTodos(prevTodos => [...prevTodos]);
        }
    };

    const deleteTodoHandler = (todo: TodoModel) => {
        if (todo.source === 'Device') {
            setDeviceTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        }
        else {
            setCloudTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        }
    };

    const replaceTodoHandler = (todo: TodoModel) => {
        if (todo.source === 'Device') {
            setDeviceTodos(prevTodos => {
                const index = prevTodos.findIndex(t => t.id === todo.id);
                if (index >= 0) {
                    console.log("found device");
                    prevTodos.splice(index, 1, todo);
                    return [...prevTodos];
                }
                else {
                    console.log("not found device");
                    setCloudTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
                    return [todo, ...prevTodos];
                }
            });
        }
        else {
            setCloudTodos(prevTodos => {
                const index = prevTodos.findIndex(t => t.id === todo.id);
                if (index >= 0) {
                    console.log("found cloud");
                    prevTodos.splice(index, 1, todo);
                    return [...prevTodos];
                }
                else {
                    console.log("not found cloud");
                    setDeviceTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
                    return [todo, ...prevTodos];
                }
            });
        }
    };

    const checkTodoHandler = (action: string, todo: TodoModel) => {
        if (action === 'DONE') {
            todo.lastLastDone = todo.lastDone;
            if (todo.repeat) {
                todo.count++;
                todo.lastDone = Dates.getDate().getTime();
            }
            else {
                todo.count--;
                todo.lastDone = Dates.getDate().getTime();
                if (todo.count <= 0) {
                    deleteTodoHandler(todo);
                    return;
                }
            }
            if (todo.source === 'Device') {
                setDeviceTodos(prevTodos => [...prevTodos.sort(sortTodoModels)]);
            }
            else {
                setCloudTodos(prevTodos => [...prevTodos.sort(sortTodoModels)]);
            }
        }
    };

    const getAllTodosSorted = () => {
        if (processing) {
            return [];
        }
        // console.log('sorting');
        return [...deviceTodos, ...cloudTodos.value].sort(sortTodoModels);
    };

    const contextValue: TodosContextType = {
        todos: getAllTodosSorted(),
        todosProcessing: processing,
        addTodo: addTodoHandler,
        deleteTodo: deleteTodoHandler,
        undoTodo: undoTodoHandler,
        replaceTodo: replaceTodoHandler,
        checkTodo: checkTodoHandler
    };

    return <TodosContext.Provider value={contextValue}>
        {props.children}
    </TodosContext.Provider>
};

export default TodosContextProvider;