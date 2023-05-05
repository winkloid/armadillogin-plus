import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import App from './App'

// Bootstrap CSS and JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Root from "./pages/root.jsx";
import ErrorPage from "./errorpage.jsx";
import Registration from "./pages/registration.jsx";
import Login from "./pages/login.jsx";
import Welcome from "./pages/welcome.jsx";
import Private from "./pages/private.jsx";
import ShortcodeLogin from "./pages/shortcodeLogin.jsx";
import AuthorizeShortcode from "./pages/shortcodeLogin/authorizeShortcode.jsx";
import GenerateShortcode from "./pages/shortcodeLogin/generateShortcode.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Welcome />
            },
            {
                path: "registration",
                element: <Registration />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "private",
                element: <Private />,
            },
            {
                path: "shortcodeLogin",
                element: <ShortcodeLogin/>
            },
            {
                path: "shortcodeLogin/authorizeShortcode",
                element: <AuthorizeShortcode />
            },
            {
                path: "shortcodeLogin/generateShortcode",
                element: <GenerateShortcode />
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
