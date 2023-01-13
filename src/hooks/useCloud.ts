import { getDatabase, onValue, ref, set } from "firebase/database";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useCloud = <S extends Object>(initialState: S, dbPath?: string): [S, Dispatch<SetStateAction<S>>] => {
    // const [cloudSub, setCloudSub] = useState<() => void>();
    const [state, setState] = useState<S>(initialState);

    useEffect(() => {
        if (!dbPath) {
            // if (cloudSub) {
            //     cloudSub();
            //     setCloudSub(undefined);
            // }
            return;
        }
        const db = getDatabase();
        /*const sub = */onValue(ref(db, dbPath), 
        snapshot => {
            setState(snapshot.val() || initialState);
        },
        error => {
            // Annoyingly, an error is sent on graceful logout as the code is.
            // The commented out code unexpectedly makes onValue not work
            // if the return Subscribe is put in a useState to purposefully unsub 
            // on graceful logout to avoid this error.
            console.error(error);
        });
        // setCloudSub(sub);
    }, [dbPath, initialState]);

    const setTodosHandler = (value: S | ((prevState: S) => S)) => {
        if (!dbPath) {
            setState(initialState);
            return;
        }
        const newValue = typeof value === 'function' ? value(state) : value;
        setState(newValue);
        const db = getDatabase();
        set(ref(db, dbPath), newValue);
    };

    return [state, setTodosHandler];
};

export default useCloud;