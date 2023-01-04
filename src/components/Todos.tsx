import { Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
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
                <TransitionGroup component='ul' classNames="todo-list">
                    {todosCtx.todos.map(todo => 
                        <CSSTransition key={todo.id} in={true} appear={true} classNames="todo-item" timeout={500}>
                            <Todo todo={todo} onCheckTodo={todosCtx.checkTodo} />
                        </CSSTransition>
                    )}
                </TransitionGroup>
                { todosCtx.todos.length === 0 ? 'Add a task by selecting the plus in the top right' : '' }
            </section>
        </Fragment>
    );
}

export default Todos;