import { Fragment, useContext, useRef, useState } from 'react';
import { AuthContext } from '../store/auth-context';

const AuthForm = () => {
    const [ isWaiting, setIsWaiting ] = useState(false);
    const [ response, setResponse ] = useState<{status: 'success' | 'error', text: string}>();
    const authCtx = useContext(AuthContext);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);

    const loginHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;

        emailRef.current!.disabled = true;
        passwordRef.current!.disabled = true;
        setIsWaiting(true);
        
        const error = await authCtx.login(email, password);
        if (error) {
            setResponse({status: 'error', text: error});
        }
        else {
            setResponse({status: 'success', text: 'Login successful'});

        }

        setIsWaiting(false);
        emailRef.current!.disabled = false;
        passwordRef.current!.disabled = false;
    };

    const logoutHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const error = await authCtx.logout();
        if (error) {
            setResponse({status: 'error', text: error});
        }
        else {
            setResponse({status: 'success', text: 'Logout successful'});

        }
    }

    const changePasswordHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const oldPassword = oldPasswordRef.current!.value;
        const newPassword = newPasswordRef.current!.value;

        oldPasswordRef.current!.disabled = true;
        newPasswordRef.current!.disabled = true;
        setIsWaiting(true);
            
        const error = await authCtx.changePassword(oldPassword, newPassword);
        if (error) {
            setResponse({status: 'error', text: error});
        }
        else {
            setResponse({status: 'success', text: 'Password change successful'});

        }

        setIsWaiting(false);
        oldPasswordRef.current!.disabled = false;
        newPasswordRef.current!.disabled = false;
        oldPasswordRef.current!.value = '';
        newPasswordRef.current!.value = '';
    }

    return <Fragment>
        <div style={{textAlign: 'center', color: response?.status === 'error' ? 'var(--miss)' : 'var(--done)'}}>{response?.text}</div>
        { authCtx.isLoggedIn ? 
            <Fragment>
                <form onSubmit={logoutHandler}>
                    <h3>Logged in as {authCtx.email}</h3>
                    <button style={{marginTop: "0.5rem"}} type='submit'>Logout</button>
                </form>
                <form onSubmit={changePasswordHandler}>
                    <h3>Change Password</h3>
                    <div>
                        <label htmlFor='oldpassword'>Old Password</label>
                        <input type='password' id='oldpassword' minLength={6} required ref={oldPasswordRef} autoComplete="current-password" />
                    </div>
                    <div>
                        <label htmlFor='newpassword'>New Password</label>
                        <input type='password' id='newpassword' minLength={6} required ref={newPasswordRef} autoComplete="new-password" />
                    </div>
                    { isWaiting ? 
                        <div className='icon-spinner spinner'></div>
                        :
                        <button type='submit'>Change Password</button>
                    } 
                </form>
            </Fragment>
            :
            <form onSubmit={loginHandler}>
                <h3>Login</h3>
                <div>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailRef} autoComplete="username"/>
                </div>
                <div>
                    <label htmlFor='password'>Your Password</label>
                    <input type='password' id='password' minLength={6} required ref={passwordRef} autoComplete="current-password" />
                </div>
                { isWaiting ? 
                    <div className='icon-spinner spinner'></div>
                    :
                    <button type='submit'>Login</button>
                } 
            </form>
        }
    </Fragment>;
};

export default AuthForm;
