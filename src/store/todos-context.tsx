import React, { useState } from "react";
import TodoModel from "../models/todo";

type TodosContextType = {
    todos: TodoModel[];
    addTodo: (todo: TodoModel) => void;
    replaceTodo: (todo: TodoModel) => void;
    removeTodo: (id: string) => void;
};

export const TodosContext = React.createContext<TodosContextType>({
    todos: [],
    addTodo: (todo: TodoModel) => { },
    replaceTodo: (todo: TodoModel) => {},
    removeTodo: (id: string) => { }
});

const TodosContextProvider: React.FC<{children?: React.ReactNode}> = (props) => {
    const [todos, setTodos] = useState<TodoModel[]>([]);

    const addTodoHandler = (newTodo: TodoModel) => {
        setTodos(prevTodos => {
            return prevTodos.concat(newTodo);
        });
    };

    const replaceTodoHandler = (todo: TodoModel) => {
        setTodos(prevTodos => {
            const index = prevTodos.findIndex(t => t.id === todo.id);
            if (index >= 0) {
                prevTodos.splice(index, 1, todo);
                return prevTodos;
            }
            console.error("Could not find todo id to replace in todos context vvv");
            console.error(todo);
            return prevTodos;
        });
    };

    const removeTodoHandler = (id: string) => {
        setTodos((prevTodos) => {
            return prevTodos.filter(todo => todo.id !== id);
        })
    };

    const contextValue: TodosContextType = {
        todos: todos,
        addTodo: addTodoHandler,
        replaceTodo: replaceTodoHandler,
        removeTodo: removeTodoHandler
    };

    return <TodosContext.Provider value={contextValue}>
        {props.children}
    </TodosContext.Provider>
};

export default TodosContextProvider;