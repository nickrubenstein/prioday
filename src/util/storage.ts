import TodoModel from "../models/todo";

export const getDeviceTodos = () => {
    const storage = localStorage.getItem("todo");
    try {
        const storageTodos = storage ? JSON.parse(storage) : [];
        return storageTodos;
    }
    catch (error) {
        console.error("VVV Error reading todos from local storage VVV");
        console.error(error);
    }
    return [];
};

export const setDeviceTodos = (todos: TodoModel[]) => {
    localStorage.setItem("todo", JSON.stringify(todos));
};