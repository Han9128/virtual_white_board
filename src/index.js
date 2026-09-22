import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/global.css'
import App from './App';
import AuthProvider from "./store/AuthProvider";
import { BrowserRouter } from "react-router";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);


