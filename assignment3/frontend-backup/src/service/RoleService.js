import axios from 'axios'

const defaultRoleList = [
    {
        id: 1,
        name: "Administator",
        desc: "All permissions",
        menu: ["*"],
        enable: true,
    },
    {
        id: 2,
        name: "Goods Manager",
        desc: "Can manage goods",
        menu: [1, 2, 4],
        enable: true,
    },
    {
        id: 3,
        name: "Order Manager",
        desc: "Can manage orders",
        menu: [1, 2],
        enable: true,
    },
]

class RoleService {
    roleList = [];

    constructor() {
        this._getData();
    }

    getRoles() {
        return this.roleList.concat();
    }

    getRole(id) {
        return this.roleList.find((role) => role.id === id);
    }

    addRole(role) {
        role.id = this.roleList.reduce((max, u) => (u.id > max ? u.id : max), 0) + 1;
        this.roleList.push(role);
        this._setData();
    }

    editRole(role) {
        const index = this.roleList.findIndex((r) => r.id === role.id);
        if (index !== -1) {
            this.roleList[index] = role;
            this._setData();
        }
    }

    deleteRole(id) {
        if (id === 1) {
            return;
        }

        const index = this.roleList.findIndex((role) => role.id === id);
        if (index !== -1) {
            this.roleList.splice(index, 1);
            this._setData();
        }
    }

    _getData() {
        axios.get('http://localhost:5000/get/roleList')
            .then(response => {
                console.log(response)
                if (response.code === 200) {
                    this.roleList = response.data;
                } else {
                    this.roleList = defaultRoleList;
                    this._setData();
                }
            })
            .catch(error => {
                console.log('Error fetching data: ', error);
                this.roleList = defaultRoleList;
                this._setData();
            })
    }

    _setData() {
        const data = {
            'key': 'roleList',
            'value': this.roleList,
        }
        axios.post('http://localhost:5000/set', data)
            .catch(error => {
                console.log('Error saving data: ', error)
            })
    }
}

export default RoleService;
