// 3rd Party Imports
import React from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
//Components
import App from './App';
//Context
import { GlobalContextProvider } from './core/context/GlobalContextProvider';
//CSS
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback='Loading Language...'>
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </React.Suspense>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
