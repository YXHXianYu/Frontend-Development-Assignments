import axios from "axios"

const defaultUserList = [
    {
        id: 1,
        username: "admin",
        password: "123456",
        name: "Administrator",
        email: "admin@example.com",
        role: [1],
        enable: true,
    },
    {
        id: 2,
        username: "goods",
        password: "123456",
        name: "Goods Manager",
        email: "goods@example.com",
        role: [2],
        enable: true,
    },
    {
        id: 3,
        username: "order",
        password: "123456",
        name: "Order Manager",
        email: "order@example.com",
        role: [3],
        enable: true,
    },
];

class UserService {
    userList = [];
    currentUserId = null; // 当前登录用户的id

    constructor() {
        this._getData();
    }

    login(username, password, remember) {
        // 比较用户名和密码，如果正确则返回用户信息，否则返回null
        const user = this.userList.find((u) => u.username === username && u.password === password);
        if (user) {
            this.currentUserId = user.id;
            if (remember) {
                localStorage.setItem('currentUserId', user.id);
            }
        }
        return !!user;
    }

    logout() {
        this.currentUserId = null;
        localStorage.removeItem('currentUserId');
    }

    register(username, password, email) {
        // 检查用户名是否已经存在，如果不存在则创建用户并返回用户信息，否则返回null
        if (this.userList.find((u) => u.username === username)) {
            return null;
        }

        const user = {
            id: 0,
            username,
            password,
            name: username,
            email: email,
            role: [],
            enable: true,
        };
        this.addUser(user);
        return user;
    }

    getCurrentUser() {
        if (!this.currentUserId) {
            this.currentUserId = localStorage.getItem('currentUserId');
        }
        return this.userList.find((u) => u.id === parseInt(this.currentUserId));
    }

    getUsers() {
        return this.userList.concat();
    }

    addUser(user) {
        user.id = this.userList.reduce((max, u) => (u.id > max ? u.id : max), 0) + 1;
        this.userList.push(user);
        this._setData();
    }

    editUser(user) {
        const index = this.userList.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            this.userList[index] = user;
            this._setData();
        }
    }

    deleteUser(id) {
        if (id === 1) {
            return;
        }

        const index = this.userList.findIndex((user) => user.id === id);
        if (index !== -1) {
            this.userList.splice(index, 1);
            this._setData();
        }
    }

    _getData() {
        axios.get('http://localhost:5000/get/userList')
            .then(response => {
                console.log(response)
                if (response.code === 200) {
                    this.userList = response.data;
                } else {
                    this.userList = defaultUserList;
                    this._setData();
                }
            })
            .catch(error => {
                console.log('Error fetching data: ', error);
                this.userList = defaultUserList;
                this._setData();
            })
    }

    _setData() {
        const data = {
            'key': 'userList',
            'value': this.userList,
        }
        axios.post('http://localhost:5000/set', data)
            .catch(error => {
                console.log('Error saving data: ', error)
            })
    }
}

export default UserService;
