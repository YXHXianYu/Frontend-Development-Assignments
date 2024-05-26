import axios from 'axios'

const defaultMenuList = [
    {
        id: 1,
        name: "Main Page",
        path: "home",
        parent: 0,
        enable: true,
        locked: true,
    },
    {
        id: 2,
        name: "Goods",
        path: "good",
        parent: 0,
        enable: true,
    },
    {
        id: 3,
        name: "Orders",
        path: "order",
        parent: 0,
        enable: true,
    },
    {
        id: 4,
        name: "Promotion",
        path: "promotion",
        parent: 0,
        enable: true,
    },
    {
        id: 5,
        name: "Authority Management",
        path: "authority",
        parent: 0,
        enable: true,
        locked: true,
    },
    {
        id: 6,
        name: "User List",
        path: "user",
        parent: 5,
        enable: true,
        locked: true,
    },
    {
        id: 7,
        name: "Menu List",
        path: "menu",
        parent: 5,
        enable: true,
        locked: true,
    },
    {
        id: 8,
        name: "Role List",
        path: "role",
        parent: 5,
        enable: true,
        locked: true,
    }
];

class MenuService {
    menuList = [];

    constructor() {
        this._getData();
    }

    getMenus() {
        return this.menuList.concat();
    }

    getDisplayMenus() {
        const buildTree = (menuList, parentId = 0) => {
            return menuList
                .filter((menu) => menu.enable && menu.parent === parentId)
                .map((menu) => {
                    const children = buildTree(menuList, menu.id);
                    return {
                        ...menu,
                        children: children.length ? children : undefined,
                    };
                });
        };
        return buildTree(this.menuList);
    }

    addMenu(menu) {
        menu.id = this.menuList.reduce((max, u) => (u.id > max ? u.id : max), 0) + 1;
        this.menuList.push(menu);
        this._setData();
    }

    editMenu(menu) {
        const index = this.menuList.findIndex((m) => m.id === menu.id);
        if (index !== -1) {
            if (this.menuList[index].locked) {
                return;
            }
            this.menuList[index] = menu;
            this._setData();
        }
    }

    deleteMenu(id) {
        const index = this.menuList.findIndex((menu) => menu.id === id);
        if (index !== -1) {
            if (this.menuList[index].locked) {
                return;
            }
            this.menuList.splice(index, 1);
            this._setData();
        }
    }

    _getData() {
        axios.get('http://localhost:5000/get/menuList')
            .then(response => {
                console.log(response)
                if (response.code === 200) {
                    this.menuList = response.data;
                } else {
                    this.menuList = defaultMenuList;
                    this._setData();
                }
            })
            .catch(error => {
                console.log('Error fetching data: ', error);
                this.menuList = defaultMenuList;
                this._setData();
            })
    }

    _setData() {
        const data = {
            'key': 'menuList',
            'value': this.menuList,
        }
        axios.post('http://localhost:5000/set', data)
            .catch(error => {
                console.log('Error saving data: ', error)
            })
    }
}

export default MenuService;