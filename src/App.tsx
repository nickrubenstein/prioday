import { Navigate, Route, Routes } from "react-router-dom";
import TodosContextProvider from "./store/todos-context";
import Nav from "./components/Nav";
import Todos from "./components/Todos";
import NewTodo from "./components/NewTodo";
import Account from "./components/Account";
import DetailTodo from "./components/DetailTodo";

const NotFound = () => {
    return <h1>Page not found</h1>;
};

const App = () => {

    return (
        <TodosContextProvider>
            <Routes>
                <Route index element={<Navigate replace to="todo" />} />
                <Route path="todo" element={<Todos />}>
                </Route>
                <Route path="todo/:todoId" element={<DetailTodo />} />
                <Route path="new" element={<NewTodo />} />
                <Route path="account" element={<Account />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Nav />
        </TodosContextProvider>
    );
}

export default App;