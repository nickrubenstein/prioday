import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import './style/index.css';
import './style/theme.css';
import './style/switch.css';
import './style/icomoon/style.css';
import App from './App';
import TodosContextProvider from './store/todos-context';
import AuthContextProvider from './store/auth-context';
import CloudContextProvider from './store/cloud-context';

const firebaseConfig = {
    apiKey: "AIzaSyCD99byCgoNRifBwZppGPSCCm28XJpX6SI",
    databaseURL: "https://prioday-58167-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getDatabase(app);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    //<React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <CloudContextProvider>
                    <TodosContextProvider>
                        <App />
                    </TodosContextProvider>
                </CloudContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    //</React.StrictMode>
);
