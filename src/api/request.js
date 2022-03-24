import axios from 'axios'

const instance = axios.create({
    baseURL: '',
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default instance