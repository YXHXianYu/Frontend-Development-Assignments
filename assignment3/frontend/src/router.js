import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import LoginPage from "./components/pages/LoginPage"
import RegisterPage from "./components/pages/RegisterPage"
import MainPage from "./components/pages/MainPage"
import HomePage from "./components/pages/HomePage"
import UserPage from "./components/pages/UserPage"

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
])

export default router