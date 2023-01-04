import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './style/index.css';
import './style/theme.css';
import './style/switch.css';
import './style/transition.css';
import './style/icomoon/style.css';
import App from './App';
import TodosContextProvider from './store/todos-context';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <TodosContextProvider>
                <App />
            </TodosContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
