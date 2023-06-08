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
import ShortcodeInput from "./pages/shortcodeLogin/shortcodeInput.jsx";
import GenerateShortcode from "./pages/shortcodeLogin/generateShortcode.jsx";
import AuthorizeShortcodeSession from "./pages/shortcodeLogin/authorizeShortcodeSession.jsx";
import About from "./pages/about.jsx";
import EIdMainPage from "./pages/eIdLogin/eIdMainPage.jsx";
import EIdRegistration from "./pages/eIdLogin/eIdRegistration.jsx";
import EIdLogin_userNameInput from "./pages/eIdLogin/eIdLogin_userNameInput.jsx";
import EIdLogin_completion from "./pages/eIdLogin/eIdLogin_completion.jsx";

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
                path: "private/:privateState",
                element: <Private />,
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
                path: "shortcodeLogin/generateShortcode",
                element: <GenerateShortcode />
            },
            {
                path: "shortcode",
                element: <ShortcodeInput />
            },
            {
                path: "shortcode/:shortcodeString",
                element: <ShortcodeInput />
            },
            {
                path: "shortcodeLogin/authorize",
                element: <AuthorizeShortcodeSession />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "eId",
                element: <EIdMainPage/>,
            },
            {
                path: "eId/registration",
                element: <EIdRegistration />
            },
            {
                path: "eId/login",
                element: <EIdLogin_userNameInput />
            },
            {
                path:"eId/login/completion",
                element: <EIdLogin_completion />
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
