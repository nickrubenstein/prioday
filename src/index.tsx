import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getPerformance } from "firebase/performance";
import './style/index.css';
import './style/theme.css';
import './style/switch.css';
import './style/icomoon/style.css';
import App from './App';
import TodosContextProvider from './store/todos-context';
import AuthContextProvider from './store/auth-context';

const firebaseConfig = {
    apiKey: "AIzaSyCD99byCgoNRifBwZppGPSCCm28XJpX6SI",
    databaseURL: "https://prioday-58167-default-rtdb.firebaseio.com",
    projectId: "prioday-58167",
    appId: "1:361310722119:web:35370c2d0c241a99043962"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getDatabase(app);
if (process.env.NODE_ENV === 'production') {
    getPerformance(app);
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    //<React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <TodosContextProvider>
                    <App />
                </TodosContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    //</React.StrictMode>
);
