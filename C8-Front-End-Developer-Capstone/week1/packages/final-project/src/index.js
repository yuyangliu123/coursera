import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from '../public/serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from 'react-toastify'; 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <ToastContainer/>
    <App />
  </BrowserRouter>

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    // Check if a service worker is already registered
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        console.log('Service worker already registered:', registration);
      } else {
        // Register a service worker hosted at the root of the
        // site using the default scope.
        navigator.serviceWorker.register("./sw.js").then(
          registration => {
            console.log('Service worker registration succeeded:', registration);
          },
        /*catch*/ error => {
            console.error(`Service worker registration failed: ${error}`);
          }
        );
      }
    });
  })
} else {
  console.error('Service workers are not supported.');
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();