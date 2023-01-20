import { Fragment, useContext, useRef, useState } from 'react';
import { AuthContext } from '../store/auth-context';

const AuthForm = () => {
    const [ response, setResponse ] = useState<{status: 'success' | 'error', text: string}>();
    const [ sentEmail, setSentEmail ] = useState(false);
    const authCtx = useContext(AuthContext);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordConfirmedRef = useRef<HTMLInputElement>(null);

    const loginHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;
        const error = await authCtx.login(email, password);
        if (error) {
            setResponse({status: 'error', text: error});
        }
        else {
            setResponse({status: 'success', text: 'Login successful'});
            setSentEmail(false);
        }
    };

    const logoutHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const error = await authCtx.logout();
        if (error) {
            setResponse({status: 'error', text: error});
        }
        else {
            setResponse({status: 'success', text: 'Logout successful'});
            setSentEmail(false);
        }
    }

    const verifyEmailHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setSentEmail(true);
        const error = await authCtx.verifyEmail();
        if (error) {
            setResponse({status: 'error', text: error});
            setSentEmail(false);
        }
        else {
            setResponse({status: 'success', text: 'Verification email sent to ' + authCtx.user?.email});
        }
    }

    const forgotPasswordHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setSentEmail(true);
        const email = emailRef.current!.value;
        const error = await authCtx.forgotPassword(email);
        if (error) {
            setResponse({status: 'error', text: error});
            setSentEmail(false);
        }
        else {
            setResponse({status: 'success', text: 'Password reset sent to ' + email});
        }
    }

    const changePasswordHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const oldPassword = oldPasswordRef.current!.value;
        const newPassword = newPasswordRef.current!.value;
        const newPasswordConfirmed = newPasswordConfirmedRef.current!.value;
        if (newPassword !== newPasswordConfirmed) {
            setResponse({status: 'error', text: 'Password does not match confirmed'});
            return;
        }
            
        const error = await authCtx.changePassword(oldPassword, newPassword);
        if (error) {
            setResponse({status: 'error', text: error});
        }
        else {
            setResponse({status: 'success', text: 'Password change successful'});

        }
        oldPasswordRef.current!.value = '';
        newPasswordRef.current!.value = '';
        newPasswordConfirmedRef.current!.value = '';
    }

    return <Fragment>
        <div style={{textAlign: 'center', color: response?.status === 'error' ? 'var(--miss)' : 'var(--done)'}}>{response?.text}</div>
        { authCtx.user ? 
            <Fragment>
                { !authCtx.user.emailVerified ?
                    <form onSubmit={verifyEmailHandler}>
                        <button style={{marginTop: "0.5rem"}} type='submit' disabled={sentEmail}>Verify Email</button>
                    </form>
                    : ''
                }
                <form onSubmit={logoutHandler}>
                    <h3>Logged in as {authCtx.user.email}</h3>
                    <button style={{marginTop: "0.5rem"}} type='submit'>Logout</button>
                </form>
                <form onSubmit={changePasswordHandler}>
                    <h3>Change Password</h3>
                    <div>
                        <label htmlFor='oldpassword'>Old Password</label>
                        <input type='password' id='oldpassword' disabled={authCtx.authProcessing} minLength={6} required ref={oldPasswordRef} autoComplete="current-password" />
                    </div>
                    <div>
                        <label htmlFor='newpassword'>New Password</label>
                        <input type='password' id='newpassword' disabled={authCtx.authProcessing} minLength={6} required ref={newPasswordRef} autoComplete="new-password" />
                    </div>
                    <div>
                        <label htmlFor='newpassword'>New Password Confirmed</label>
                        <input type='password' id='newpassword' disabled={authCtx.authProcessing} minLength={6} required ref={newPasswordConfirmedRef} autoComplete="new-password" />
                    </div>
                    { authCtx.authProcessing ? 
                        <div className='icon-spinner spinner'></div>
                        :
                        <button type='submit'>Change Password</button>
                    } 
                </form>
            </Fragment>
            :
            <Fragment>
                <form onSubmit={loginHandler}>
                    <h3>Login</h3>
                    <div>
                        <label htmlFor='email'>Your Email</label>
                        <input type='email' id='email' disabled={authCtx.authProcessing} required ref={emailRef} autoComplete="username"/>
                    </div>
                    <div>
                        <label htmlFor='password'>Your Password</label>
                        <input type='password' id='password' disabled={authCtx.authProcessing} minLength={6} required ref={passwordRef} autoComplete="current-password" />
                    </div>
                    { authCtx.authProcessing ? 
                        <div className='icon-spinner spinner'></div>
                        :
                        <button type='submit'>Login</button>
                    } 
                </form>
                <form onSubmit={forgotPasswordHandler}>
                    { authCtx.authProcessing ? 
                        '' :
                        <button style={{marginTop: "0.5rem"}} type='submit' disabled={sentEmail}>Forgot Password</button>
                    }
                </form>
            </Fragment>
        }
    </Fragment>;
};

export default AuthForm;
