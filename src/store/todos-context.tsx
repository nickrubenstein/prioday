import React, { useEffect, useState } from "react";
import TodoModel from "../models/todo";
import { next, sortFrequencies } from "../util/frequency";

type TodosContextType = {
    todos: TodoModel[];
    addTodo: (todo: TodoModel) => void;
    replaceTodo: (todo: TodoModel) => void;
    checkTodo: (action: string, todo: TodoModel) => void;
};

const sortTodos = (a: TodoModel, b: TodoModel) => {
    const aNext = next(a.lastDone, a.frequency).getTime();
    const bNext = next(b.lastDone, b.frequency).getTime();
    if (aNext === bNext) {
        return sortFrequencies(a.frequency, b.frequency);
    }
    return aNext - bNext;
};

export const TodosContext = React.createContext<TodosContextType>({
    todos: [],
    addTodo: (todo: TodoModel) => { },
    replaceTodo: (todo: TodoModel) => {},
    checkTodo: (action: string, todo: TodoModel) => { }
});

const TodosContextProvider: React.FC<{children?: React.ReactNode}> = (props) => {
    const [todos, setTodos] = useState<TodoModel[]>(() => {
        const storage = localStorage.getItem("todos");
        const storageTodos = storage ? JSON.parse(storage) : [];
        storageTodos.sort(sortTodos)
        console.log("getting todos");
        return storageTodos;
    });

    useEffect(() => {
        console.log("storing todos");
        todos.sort(sortTodos);
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodoHandler = (newTodo: TodoModel) => {
        console.log("add todos");
        setTodos(prevTodos => {
            return prevTodos.concat(newTodo);
        });
    };

    const replaceTodoHandler = (todo: TodoModel) => {
        console.log("replace todos");
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
        console.log("check todos");
        if (action === 'DONE') {
            console.log(todo);
            if (todo.repeat) {
                todo.lastDone = Date.now();
                setTodos((prevTodos) => [...prevTodos]);
            }
            else {
                setTodos((prevTodos) => {
                    return prevTodos.filter(t => t.id !== todo.id);
                })
            }
        }
        
    };

    const contextValue: TodosContextType = {
        todos: todos,
        addTodo: addTodoHandler,
        replaceTodo: replaceTodoHandler,
        checkTodo: checkTodoHandler
    };

    return <TodosContext.Provider value={contextValue}>
        {props.children}
    </TodosContext.Provider>
};

export default TodosContextProvider;