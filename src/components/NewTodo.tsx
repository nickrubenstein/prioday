import React, { Fragment, useContext } from "react";
import TodoModel from "../models/todo";
import { TodosContext } from "../store/todos-context";
import FormTodo from "./FormTodo";

const NewTodo: React.FC = () => {
    const todosCtx = useContext(TodosContext);

    const submitHandler = (todo: TodoModel) => {
        todosCtx.addTodo(todo);
    };

    return (
        <Fragment>
            <h1>Create New Task</h1>
            <FormTodo onSubmit={submitHandler}/>
        </Fragment>
    );
}

export default NewTodo;