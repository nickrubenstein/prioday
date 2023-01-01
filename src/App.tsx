import { Navigate, Route, Routes } from "react-router-dom";
import Todos from "./components/Todos";
import NewTodo from "./components/NewTodo";
import Settings from "./components/Settings";
import DetailTodo from "./components/DetailTodo";
import { useEffect, useState } from "react";

const NotFound = () => {
    return <h1>Page not found</h1>;
};

const App = () => {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem("theme") || (defaultDark ? 'dark' : 'light');
        return storedTheme;
    });
    const onTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };
    useEffect(() => {
        console.log("changing theme");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div id="app" data-theme={theme}>
            <Routes>
                <Route index element={<Navigate replace to="todo" />} />
                <Route path="todo" element={<Todos />} />
                <Route path="todo/:todoId" element={<DetailTodo />} />
                <Route path="new" element={<NewTodo />} />
                <Route path="settings" element={<Settings theme={theme} onTheme={onTheme} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;