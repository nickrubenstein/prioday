import { Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import { TodosContext } from "../store/todos-context";
import Todo from "./Todo";

const Todos: React.FC = () => {
    const todosCtx = useContext(TodosContext);

    return (
        <Fragment>
                <h1>
                    <NavLink to="/settings"><span className="icon-cog margin-left"></span></NavLink>
                    <span className="align-left">Prioday {new Date().toLocaleDateString()}</span>
                    <NavLink to="/new"><span className="icon-plus margin-right"></span></NavLink>
                </h1>
            <section>
                <ul>
                    {todosCtx.todos.map(todo => (
                        <Todo key={todo.id} todo={todo} onCheckTodo={todosCtx.checkTodo} />
                    ))}
                </ul>
            </section>
        </Fragment>
    );
}

export default Todos;