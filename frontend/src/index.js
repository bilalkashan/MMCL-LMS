import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';  // Your main App component (contains Routes and RefreshHandler)

// Create the router (you can also define routes here if you want, or inside App)
const router = createBrowserRouter(
  [
    // If your routes are defined inside App component using <Routes>, 
    // this router can be minimal or just use an empty array.
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Wrap your app with RouterProvider using the created router
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
);
