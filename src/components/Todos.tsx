import { Fragment, useContext } from "react";
import { TodosContext } from "../store/todos-context";
import Todo from "./Todo";

const Todos: React.FC = () => {
    const todosCtx = useContext(TodosContext);

    return (
        <Fragment>
            <h1>Prioday</h1>
            <h1>{new Date().toLocaleDateString()}</h1>
            <ul>
                {todosCtx.todos.map(todo => (
                    <Todo key={todo.id} todo={todo} onCheckTodo={todosCtx.checkTodo} />
                ))}
            </ul>
        </Fragment>
    );
}

export default Todos;