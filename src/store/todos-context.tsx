import React, { useEffect, useState } from "react";
import TodoModel, { sortTodoModels } from "../models/todo";
import * as Dates from "../util/dates";

type TodosContextType = {
    todos: TodoModel[];
    sortTodos: () => void;
    addTodo: (todo: TodoModel) => void;
    deleteTodo: (todo: TodoModel) => void;
    undoTodo: (todo: TodoModel) => void;
    replaceTodo: (todo: TodoModel) => void;
    checkTodo: (action: string, todo: TodoModel) => void;
};

export const TodosContext = React.createContext<TodosContextType>({
    todos: [],
    sortTodos: () => {},
    addTodo: (todo: TodoModel) => { },
    deleteTodo: (todo: TodoModel) => { },
    undoTodo: (todo: TodoModel) => { },
    replaceTodo: (todo: TodoModel) => {},
    checkTodo: (action: string, todo: TodoModel) => { }
});

const TodosContextProvider: React.FC<{children?: React.ReactNode}> = (props) => {
    const [todos, setTodos] = useState<TodoModel[]>(() => {
        const storage = localStorage.getItem("todos");
        const storageTodos = storage ? JSON.parse(storage) : [];
        storageTodos.sort(sortTodoModels);
        return storageTodos;
    });

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const sortTodosHandler = () => {
        setTodos(prevTodos => [...prevTodos.sort(sortTodoModels)]);
    };

    const addTodoHandler = (newTodo: TodoModel) => {
        setTodos(prevTodos => [newTodo, ...prevTodos]);
    };

    const undoTodoHandler = (todo: TodoModel) => {
        todo.lastDone =  todo.lastLastDone;
        if (todo.repeat) {
            todo.count--;
        }
        else {
            todo.count++;
        }
        setTodos(prevTodos => [...prevTodos]);
    };

    const deleteTodoHandler = (todo: TodoModel) => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
    };

    const replaceTodoHandler = (todo: TodoModel) => {
        setTodos(prevTodos => {
            const index = prevTodos.findIndex(t => t.id === todo.id);
            if (index >= 0) {
                prevTodos.splice(index, 1, todo);
                return [...prevTodos];
            }
            console.error("Could not find todo id to replace in todos context vvv");
            console.error(todo);
            return prevTodos;
        });
    };

    const checkTodoHandler = (action: string, todo: TodoModel) => {
        if (action === 'DONE') {
            todo.lastLastDone = todo.lastDone;
            if (todo.repeat) {
                todo.count++;
                todo.lastDone = Dates.getDate().getTime();
                setTodos(prevTodos => [...prevTodos]);
            }
            else {
                todo.count--;
                todo.lastDone = Dates.getDate().getTime();
                if (todo.count < 0) {
                    setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
                }
                else {
                    setTodos(prevTodos => [...prevTodos]);
                }
            }
        }
    };

    const contextValue: TodosContextType = {
        todos: todos,
        sortTodos: sortTodosHandler,
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