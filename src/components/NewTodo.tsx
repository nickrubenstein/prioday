import React, { useContext } from "react";
import TodoModel from "../models/todo";
import { TodosContext } from "../store/todos-context";
import FormTodo from "./FormTodo";

const NewTodo: React.FC = () => {
    const todosCtx = useContext(TodosContext);

    const submitHandler = (todo: TodoModel) => {
        todosCtx.addTodo(todo);
    };

    return (
        <FormTodo onSubmit={submitHandler}/>
    );
}

export default NewTodo;