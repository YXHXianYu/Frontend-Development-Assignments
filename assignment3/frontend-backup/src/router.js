import { createBrowserRouter } from "react-router-dom";
// 具体的路由页面
import App from "./App";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomPage from "./pages/CustomPage";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import RolePage from "./pages/RolePage";
import MenuPage from "./pages/MenuPage";
import MenuService from "./service/MenuService";

const menuService = new MenuService();
const menus = menuService.getMenus();

const customRouters = menus.filter(menu => !menu.locked).map(menu => {
    return {
        path: `/main/${menu.path}`,
        Component: CustomPage,
    }
});

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
                    ...customRouters,
                    {
                        path: "/main/user",
                        Component: UserPage,
                    },
                    {
                        path: "/main/role",
                        Component: RolePage,
                    },
                    {
                        path: "/main/menu",
                        Component: MenuPage,
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