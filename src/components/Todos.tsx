import { Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import { TodosContext } from "../store/todos-context";
import Todo from "./Todo";

const Todos: React.FC = () => {
    const todosCtx = useContext(TodosContext);

    const sortHandler = (event: React.MouseEvent) => {
        todosCtx.sortTodos();
    };

    return (
        <Fragment>
            <h1>
                <NavLink to="/settings"><span className="icon-cog margin-left"></span></NavLink>
                <span className="align-left" onClick={sortHandler}>Prioday {new Date().toLocaleDateString()}</span>
                <NavLink to="/new"><span className="icon-plus margin-right"></span></NavLink>
            </h1>
            <section>
                <ul>
                    {todosCtx.todos.map(todo => (
                        <Todo key={todo.id} todo={todo} onCheckTodo={todosCtx.checkTodo} />
                    ))
                }
                { todosCtx.todos.length === 0 ? 'Add a task by selecting the plus in the top right' : '' }
                </ul>
            </section>
        </Fragment>
    );
}

export default Todos;