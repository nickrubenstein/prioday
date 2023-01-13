import { Dispatch, SetStateAction, useState } from "react";

const useStorage = <S extends Object | string | number>(initialState: S, key: string): [S, Dispatch<SetStateAction<S>>] => {
    const [state, setState] = useState<S>(() => {
        const storage = localStorage.getItem(key);
        try {
            const storageJson = storage ? JSON.parse(storage) : initialState;
            return storageJson;
        }
        catch (error) {
            console.error("VVV Error reading todos from local storage VVV");
            console.error(error);
        }
        return initialState;
    });

    const setStateHandler = (value: S | ((prevState: S) => S)) => {
        const newValue = typeof value === 'function' ? value(state) : value;
        setState(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [state, setStateHandler];
};

export default useStorage;