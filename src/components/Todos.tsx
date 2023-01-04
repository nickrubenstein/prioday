import { Fragment, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import { TodosContext } from "../store/todos-context";
import TodoModel from "../models/todo";
import Todo from "./Todo";

const Todos: React.FC = () => {
    const todosCtx = useContext(TodosContext);
    const [flipKey, setFlipKey] = useState(true);
    
    const sortHandler = () => {
        todosCtx.sortTodos();
        setFlipKey(!flipKey);
    };

    const checkHandler = (action: string, todo: TodoModel) => {
        todosCtx.checkTodo(action, todo);
        todosCtx.sortTodos();
        setFlipKey(!flipKey);
    };

    return <Fragment>
        <h1>
            <NavLink to="/settings"><span className="icon-cog margin-left"></span></NavLink>
            <span className="align-left" onClick={sortHandler}>Prioday {new Date().toLocaleDateString()}</span>
            <NavLink to="/new"><span className="icon-plus margin-right"></span></NavLink>
        </h1>
        <section>
            <Flipper element="ul" flipKey={flipKey} spring="veryGentle">
                {todosCtx.todos.map((todo, index) =>
                    <Flipped flipId={todo.id} key={todo.id}>
                        <div className="flipped-item">
                            <Todo todo={todo} index={index} onCheckTodo={checkHandler} />
                        </div>
                    </Flipped>
                )}
            </Flipper>
            {todosCtx.todos.length === 0 ? 'Add a task by selecting the plus in the top right' : ''}
        </section>
    </Fragment>;
}

export default Todos;