import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updatePassword, User } from "firebase/auth";

type AuthContextType = {
    uid?: string,
    email?: string | null,
    loggedIn: boolean,
    authProcessing: boolean,
    login: (email: string, password: string) => Promise<string | null>,
    changePassword: (oldPassword: string, newPassword: string) => Promise<string | null>,
    logout: () => Promise<string | null>
};

export const AuthContext = createContext<AuthContextType>({
    uid: '',
    email: '',
    loggedIn: false,
    authProcessing: false,
    login: async (email: string, password: string) => null,
    changePassword: async (oldPassowrd: string, newPassword: string) => null,
    logout: async () => null,
});

const AuthContextProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
    const [user, setUser] = useState<User | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        setProcessing(true);
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            setUser(user || null);
            setProcessing(false);
        },
        error => {
            console.error(error);
            setProcessing(false);
        },
        () => {
            console.log('completed');
        });
    }, []);

    const loginHandler = async (email: string, password: string) => {
        try {
            setProcessing(true);
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch (error: any) {
            console.error(error.message);
            return error.message;
        }
        finally {
            setProcessing(false);
        }
        return null;
    };

    const changePasswordHandler = async (oldPassowrd: string, newPassword: string) => {
        if (!user || !user.email) {
            return null;
        }
        try {
            const err = await loginHandler(user.email, oldPassowrd);
            setProcessing(true);
            if (err) {
                return err;
            }
            await updatePassword(user, newPassword);
        }
        catch (error: any) {
            console.error(error.message);
            return error.message;
        }
        finally {
            setProcessing(false);
        }
        return null;
    };

    const logoutHandler = async () => {
        const auth = getAuth();
        try {
            setProcessing(true);
            await auth.signOut();
        }
        catch (error: any) {
            console.error(error.message);
            setProcessing(false);
            return error.message;
        }
        finally {
            setProcessing(false);
        }
        return null;
    };

    const contextValue: AuthContextType = {
        uid: user?.uid,
        email: user?.email,
        loggedIn: !!user,
        authProcessing: processing,
        login: loginHandler,
        changePassword: changePasswordHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
};

export default AuthContextProvider;