import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updatePassword, User } from "firebase/auth";

type AuthContextType = {
    user?: User | null,
    uid?: string,
    email?: string | null,
    isLoggedIn: boolean,
    login: (email: string, password: string) => Promise<string | null>,
    changePassword: (oldPassword: string, newPassword: string) => Promise<string | null>,
    logout: () => Promise<string | null>
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    uid: '',
    email: '',
    isLoggedIn: false,
    login: async (email: string, password: string) => null,
    changePassword: async (oldPassowrd: string, newPassword: string) => null,
    logout: async () => null,
});

const AuthContextProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            setUser(user || null);
        });
    }, []);

    const loginHandler = async (email: string, password: string) => {
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch (error: any) {
            console.error(error.message);
            return error.message;
        }
        return null;
    };

    const changePasswordHandler = async (oldPassowrd: string, newPassword: string) => {
        if (!user || !user.email) {
            return null;
        }
        try {
            const err = await loginHandler(user.email, oldPassowrd);
            if (err) {
                return err;
            }
            await updatePassword(user, newPassword);
        }
        catch (error: any) {
            console.error(error.message);
            return error.message;
        }
        return null;
    };

    const logoutHandler = async () => {
        const auth = getAuth();
        try {
            await auth.signOut();
        }
        catch (error: any) {
            console.error(error.message);
            return error.message;
        }
        return null;
    };

    const contextValue: AuthContextType = {
        user: user,
        uid: user?.uid,
        email: user?.email,
        isLoggedIn: !!user,
        login: loginHandler,
        changePassword: changePasswordHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
};

export default AuthContextProvider;