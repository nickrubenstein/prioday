import React, { Fragment, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
            <h1>
                <NavLink to="/todo"><span className="icon-undo2"></span></NavLink>
                Create New Task
                <span></span>
            </h1>
            <section>
                <FormTodo onSubmit={submitHandler}/>
            </section>
        </Fragment>
    );
}

export default NewTodo;