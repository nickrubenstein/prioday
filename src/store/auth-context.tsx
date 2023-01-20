import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword, User } from "firebase/auth";

type AuthContextType = {
    user: User | null,
    authProcessing: boolean,
    login: (email: string, password: string) => Promise<string | null>,
    changePassword: (oldPassword: string, newPassword: string) => Promise<string | null>,
    verifyEmail: () => Promise<string | null>,
    forgotPassword: (email: string) => Promise<string | null>,
    logout: () => Promise<string | null>
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    authProcessing: false,
    login: async (email: string, password: string) => null,
    changePassword: async (oldPassowrd: string, newPassword: string) => null,
    verifyEmail: async () => null,
    forgotPassword: async (email: string) => null,
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
            return 'Must be logged in to change password';
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

    const verifyEmailHandler = async () => {
        if (!user) {
            return 'Must be logged in to verify email';
        }
        try {
            setProcessing(true);
            await sendEmailVerification(user);
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

    const forgotPasswordHandler = async (email: string) => {
        if (!email || !email.trim()) {
            return 'No email specified';
        }
        try {
            setProcessing(true);
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
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
            return error.message;
        }
        finally {
            setProcessing(false);
        }
        return null;
    };

    const contextValue: AuthContextType = {
        user: user,
        authProcessing: processing,
        login: loginHandler,
        changePassword: changePasswordHandler,
        verifyEmail: verifyEmailHandler,
        forgotPassword: forgotPasswordHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
};

export default AuthContextProvider;