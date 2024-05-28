import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import LoginPage from "./components/pages/LoginPage"
import RegisterPage from "./components/pages/RegisterPage"
import MainPage from "./components/pages/MainPage"
import HomePage from "./components/pages/HomePage"
import UserPage from "./components/pages/UserPage"
import RolePage from "./components/pages/RolePage"
import GoodsPage from "./components/pages/GoodsPage"
import OrderPage from "./components/pages/OrderPage"
import GamesPage from "./components/pages/GamesPage"
import AuthorityPage from "./components/pages/AuthorityPage"

const router = createBrowserRouter([ {
        path: "/",
        Component: App,
        children: [ {
            path: "/login",
            Component: LoginPage,
        }, {
            path: "/register",
            Component: RegisterPage,
        }, {
            path: "/main",
            Component: MainPage,
            children: [ {
                path: "/main/home",
                Component: HomePage,
            }, {
                path: "/main/user",
                Component: UserPage,
            }, {
                path: "/main/role",
                Component: RolePage,
            }, {
                path: "/main/goods",
                Component: GoodsPage,
            }, {
                path: "/main/order",
                Component: OrderPage,
            }, {
                path: "/main/games",
                Component: GamesPage,
            }, {
                path: "/main/authorization",
                Component: AuthorityPage,
            }, {
                path: "/main/*",
                Component: HomePage,
            }],
        }],
    },
])

export default router