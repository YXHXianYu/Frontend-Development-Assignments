import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";

const router = createBrowserRouter([ {
        path: "/",
        Component: App,
        children: [
            {
                path: "/login",
                Component: LoginPage,
            },
            {
                path: "/register",
                Component: RegisterPage,
            },
            {
                path: "/main",
                Component: MainPage,
                children: [
                    {
                        path: "/main/home",
                        Component: HomePage,
                    },
                    {
                        path: "/main/user",
                        Component: UserPage,
                    },
                    {
                        path: "/main/*",
                        Component: HomePage,
                    },
                ],
            },
        ],
    },
]);

export default router;