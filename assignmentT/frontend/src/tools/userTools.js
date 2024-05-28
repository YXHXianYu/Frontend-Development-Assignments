import axios from "axios"

export const encode = (password) => {
    let result = 0
    for (let i = 0; i < password.length; i++) {
        result = result * 31 + password.charCodeAt(i)
    }
    result %= 1000000007
    return result.toString()
}

export const load = async (key) => {
    try {
        const response = await axios.get('http://localhost:5000/get/' + key);
        if (response.status === 200) {
            return response.data.value;
        } else {
            console.log('Error getting data (Response status is not 200): ', response.status);
            return null;
        }
    } catch (error) {
        console.log('Error getting data: ', error);
        return null;
    }
}

export const save = async (key, value) => {
    const data = {
        'key': key,
        'value': value,
    }
    try {
        await axios.post('http://localhost:5000/set', data);
        return true;
    } catch (error) {
        console.log('Error setting data: ', error);
        return null;
    }
}