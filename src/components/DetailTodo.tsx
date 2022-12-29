import React, { Fragment, useContext } from "react";
import { useParams } from "react-router-dom";
import TodoModel from "../models/todo";
import { TodosContext } from "../store/todos-context";
import FormTodo from "./FormTodo";

const DetailTodo: React.FC = () => {
    const todosCtx = useContext(TodosContext);
    const { todoId } = useParams();

    const todo = todosCtx.todos.find(t => t.id === todoId);
    if (!todo) {
        return <h1>Could not find Todo {todoId}</h1>;
    }

    const submitHandler = (todo: TodoModel) => {
        todosCtx.replaceTodo(todo);
    };

    return <Fragment>
        <h1>Edit Task</h1>
        <div>{JSON.stringify(todo)}</div>
        <FormTodo todo={todo} onSubmit={submitHandler}/>
    </Fragment>;
}

export default DetailTodo;