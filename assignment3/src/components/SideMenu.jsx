import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";

const SideMenu = () => {
  const { menu: menuService, user: userService, role: roleService } = useContext(ServiceContext);

  const user = userService.getCurrentUser();
  const roles = user ? user.role.map(roleId => roleService.getRole(roleId)) : [];
  const visibleMenus = new Set(roles.flatMap(role => role.menu));
  const canSeeAllMenus = user ? user.role.includes(1): false;

  const buildMenuItems = menus => menus.filter(menu => {
    return menu.id === 1 || canSeeAllMenus || visibleMenus.has(menu.id);
  }).map(menu => {
    const item = {
      key: menu.id,
      label: <Link to={`/main/${menu.path}`}>{menu.name}</Link>,
    }
    if (menu.children) {
      item.children = buildMenuItems(menu.children);
    }
    return item;
  });
  const menuItems = buildMenuItems(menuService.getDisplayMenus());

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["home"]}
      defaultOpenKeys={["permission"]}
      style={{
        height: "100%",
        borderRight: 0,
      }}
      items={menuItems}
    />
  )
}

export default SideMenu;