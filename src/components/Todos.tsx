import { useContext } from "react";
import { TodosContext } from "../store/todos-context";
import Todo from "./Todo";

const Todos: React.FC = () => {
    const todosCtx = useContext(TodosContext);

    return (
        <ul>
            {todosCtx.todos.map(todo => (
                <Todo key={todo.id} todo={todo} onCheckTodo={todosCtx.checkTodo} />
            ))}
        </ul>
    );
}

export default Todos;