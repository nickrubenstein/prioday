import React, { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TodoModel from "../models/todo";
import { TodosContext } from "../store/todos-context";
import FormTodo from "./FormTodo";

const NewTodo: React.FC = () => {
    const todosCtx = useContext(TodosContext);
    const navigate = useNavigate();

    const submitHandler = (todo: TodoModel) => {
        todosCtx.addTodo(todo);
        navigate("/todo");
    };

    return (
        <Fragment>
            <h1>Create New Task</h1>
            <section>
                <FormTodo onSubmit={submitHandler}/>
            </section>
        </Fragment>
    );
}

export default NewTodo;