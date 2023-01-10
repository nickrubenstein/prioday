import { get, getDatabase, onValue, ref, set } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import TodoModel from "../models/todo";
import { AuthContext } from "./auth-context";

type CloudContextType = {
    cloudTodos: TodoModel[],
    setCloudTodos: (todos: TodoModel[]) => Promise<boolean>
};

export const CloudContext = createContext<CloudContextType>({
    cloudTodos: [],
    setCloudTodos: async (todos: TodoModel[]) => true
});

const CloudContextProvider: React.FC<{children?: React.ReactNode}> = (props) => {
    const { isLoggedIn, uid } = useContext(AuthContext);
    const [cloudSub, setCloudSub] = useState<(() => void) | null>(null);
    const [todos, setTodos] = useState<TodoModel[]>([]);

    const subCloudTodos = async () => {
        const db = getDatabase();
        const todosRef = ref(db, 'users/' + uid + '/todos');
        const sub = onValue(todosRef, (snapshot) => {
            console.log("onValue");
            const todos = snapshot.val();
            // console.log(todos);
            setTodos(todos || []);
        }, error => {
            console.error("cloud todo list connection failed");
            console.error(error);
        });
        if (cloudSub) {
            cloudSub();
        }
        setCloudSub(sub);
        // console.log("getting cloud todos");
        const snapshot = await get(ref(db, 'users/' + uid + '/todos'));
        setTodos(snapshot.val());
    };
    
    const unsubCloudTodos = () => {
        if (cloudSub) {
            cloudSub();
            setCloudSub(null);
        }
    }

    useEffect(() => {
        // console.log("isLoggedIn effect changed " + isLoggedIn + ' ' + uid);
        if (!isLoggedIn || !uid) {
            unsubCloudTodos();
            setTodos([]);
            return;
        }
        subCloudTodos();
    // eslint-disable-next-line
    }, [isLoggedIn]);

    const setTodosHandler = async (todos: TodoModel[]) => {
        if (!isLoggedIn || !uid) {
            return false;
        }
        setTodos(todos);
        const db = getDatabase();
        await set(ref(db, 'users/' + uid + '/todos'), todos);
        return true;
    };
    // console.log('cloud context VVV');
    // console.log(todos);
    const contextValue: CloudContextType = {
        cloudTodos: todos,
        setCloudTodos: setTodosHandler
    };

    return <CloudContext.Provider value={contextValue}>
        {props.children}
    </CloudContext.Provider>
};

export default CloudContextProvider;