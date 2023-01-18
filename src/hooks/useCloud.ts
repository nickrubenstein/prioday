import { getDatabase, onValue, ref, set } from "firebase/database";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type CloudValue = Object | Array<CloudValue> | string | number | boolean | null;

type ClousState<V> = {
    value: V, 
    status: 'processing' | 'connected' | 'disconnected'
}

const useCloud = <S extends CloudValue>(initialState: S, dbPath?: string): [ClousState<S>, Dispatch<SetStateAction<S>>] => {
    const [state, setState] = useState<ClousState<S>>({ 
        value: initialState, 
        status: 'processing'
    });

    useEffect(() => {
        if (!dbPath) {
            // if (cloudSub) {
            //     cloudSub();
            //     setCloudSub(undefined);
            // }
            setState({ value: initialState, status: 'disconnected'});
            return;
        }
        setState({ value: initialState, status: 'processing'});
        const db = getDatabase();
        /*const sub = */onValue(ref(db, dbPath), 
        snapshot => {
            setState({ value: snapshot.val() || initialState, status: 'connected'});
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

    const setStateHandler = (value: S | ((prevState: S) => S)) => {
        if (!dbPath) {
            setState({ value: initialState, status: 'disconnected' });
            return;
        }
        const newValue = typeof value === 'function' ? value(state.value) : value;
        setState({ value: newValue, status: 'connected' });
        const db = getDatabase();
        set(ref(db, dbPath), newValue);
    };

    return [state, setStateHandler];
};

export default useCloud;