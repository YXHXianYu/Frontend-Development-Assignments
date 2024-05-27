import axios from "axios"

const encode = (password) => {
    let result = 0
    for (let i = 0; i < password.length; i++) {
        result = result * 31 + password.charCodeAt(i)
    }
    result %= 1000000007
    return result.toString()
}

const defaultUserList = [
    {
        id: 1,
        username: "admin",
        password: encode("123456Aa"),
        name: "Administrator",
        email: "admin@example.com",
    },
    {
        id: 2,
        username: "yxhxianyu",
        password: encode("123456Aa"),
        name: "YXH_XianYu",
        email: "yxhxianyu@gmail.com",
    },
    {
        id: 3,
        username: "lovekdl",
        password: encode("123456Aa"),
        name: "lovekdl",
        email: "orz@lovekdl.gg",
    },
]

class UserService {
    userList = []
    currentUserId = null // 当前登录用户的id

    constructor() {
        this._getData()
    }

    login(username, password, remember) {
        password = encode(password)
        const user = this.userList.find((u) => u.username === username && u.password === password)
        if (user) {
            this.currentUserId = user.id
            if (remember) {
                localStorage.setItem('currentUserId', user.id)
            }
        }
        return !!user
    }

    logout() {
        this.currentUserId = null
        localStorage.removeItem('currentUserId')
    }

    register(username, password, email) {
        password = encode(password)
        if (this.userList.find((u) => u.username === username)) {
            return null
        }

        const user = {
            id: 0,
            username,
            password,
            name: username,
            email,
        }
        if (!this.addUser(user)) return null
        return user
    }

    async getCurrentUser() {
        await this._getData()
        if (!this.currentUserId) {
            this.currentUserId = localStorage.getItem('currentUserId')
        }
        // console.log('currentUserId: ', this.currentUserId)
        // console.log('userList: ', this.userList)
        return this.userList.find((u) => u.id === parseInt(this.currentUserId))
    }

    getUsers() {
        return this.userList.concat()
    }

    addUser(user) {
        user.id = this.userList.reduce((max, u) => (u.id > max ? u.id : max), 0) + 1
        this.userList.push(user)
        this._setData()
    }

    editUser(user) {
        const index = this.userList.findIndex((u) => u.id === user.id)
        if (index !== -1) {
            this.userList[index] = user
            this._setData()
        }
    }

    deleteUser(id) {
        if (id === 1) {
            return
        }

        const index = this.userList.findIndex((user) => user.id === id)
        if (index !== -1) {
            this.userList.splice(index, 1)
            this._setData()
        }
    }


    async _getData() {
        await axios.get('http://localhost:5000/get/userList')
            .then(response => {
                if (response.status === 200) {
                    this.userList = response.data.value
                } else {
                    this.userList = defaultUserList
                    this._setData()
                }
            })
            .catch(error => {
                console.log('Error fetching data: ', error)
                this.userList = defaultUserList
                this._setData()
            })
    }

    async _setData() {
        const data = {
            'key': 'userList',
            'value': this.userList,
        }
        await axios.post('http://localhost:5000/set', data)
            .catch(error => {
                console.log('Error saving data: ', error)
            })
    }
}

export default UserService
