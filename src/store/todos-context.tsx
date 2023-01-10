import React, { useEffect, useState, useContext } from "react";
import TodoModel, { sortTodoModels } from "../models/todo";
import * as Dates from "../util/dates";
import * as Storage from "../util/storage";
import { CloudContext } from "./cloud-context";

type TodosContextType = {
    todos: TodoModel[];
    addTodo: (todo: TodoModel) => void;
    deleteTodo: (todo: TodoModel) => void;
    undoTodo: (todo: TodoModel) => void;
    replaceTodo: (todo: TodoModel) => void;
    checkTodo: (action: string, todo: TodoModel) => void;
};

export const TodosContext = React.createContext<TodosContextType>({
    todos: [],
    addTodo: (todo: TodoModel) => { },
    deleteTodo: (todo: TodoModel) => { },
    undoTodo: (todo: TodoModel) => { },
    replaceTodo: (todo: TodoModel) => { },
    checkTodo: (action: string, todo: TodoModel) => { }
});

const TodosContextProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
    const { cloudTodos, setCloudTodos } = useContext(CloudContext);
    const [deviceTodos, setDeviceTodos] = useState<TodoModel[]>(Storage.getDeviceTodos());

    useEffect(() => {
        // console.log("todo effect device changed VVV");
        // console.log(deviceTodos);
        Storage.setDeviceTodos(deviceTodos);
    }, [deviceTodos]);

    const addTodoHandler = (newTodo: TodoModel) => {
        if (newTodo.source === 'Device') {
            setDeviceTodos(prevTodos => [newTodo, ...prevTodos]);
        }
        else {
            setCloudTodos([newTodo, ...cloudTodos]);
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
            setCloudTodos([...cloudTodos]);
        }
    };

    const deleteTodoHandler = (todo: TodoModel) => {
        if (todo.source === 'Device') {
            setDeviceTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        }
        else {
            setCloudTodos(cloudTodos.filter(t => t.id !== todo.id));
        }
    };

    const replaceTodoHandler = (todo: TodoModel) => {
        if (todo.source === 'Device') {
            setDeviceTodos(prevTodos => {
                const index = prevTodos.findIndex(t => t.id === todo.id);
                if (index >= 0) {
                    prevTodos.splice(index, 1, todo);
                    return [...prevTodos];
                }
                else {
                    console.error("Could not find todo id to replace in todos device context vvv");
                    console.error(todo);
                }
                return prevTodos;
            });
        }
        else {
            const index = cloudTodos.findIndex(t => t.id === todo.id);
            if (index >= 0) {
                cloudTodos.splice(index, 1, todo);
                setCloudTodos([...cloudTodos]);
            }
            else {
                console.error("Could not find todo id to replace in todos cloud context vvv");
                console.error(todo);
            }
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
                setCloudTodos([...cloudTodos.sort(sortTodoModels)]);
            }
        }
    };

    const getAllTodosSorted = () => {
        // console.log('sorting');
        return [...deviceTodos, ...cloudTodos].sort(sortTodoModels);
    };

    const contextValue: TodosContextType = {
        todos: getAllTodosSorted(),
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