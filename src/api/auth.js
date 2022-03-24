import request from '@/api/request.js'

const login = (payload) => {
    return request({
        baseURL: 'https://pre.z1mobile.com/api/v2/signin-or-signup',
        method: 'POST',
        data: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
}

const serviceToken = (token) => {
    return request({
        baseURL: 'https://pre.z1mobile.com/api/v2/service-tokens',
        method: 'POST',
        data: {
            service_id: 7
        },
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${token}`,
        }
    })
}

const verifyUser = (payload) => {
    return request({
        baseURL: 'https://pre.z1mobile.com/api/v2/verify-code',
        method: 'POST',
        data: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
}

const updateUser = (payload, token) => {
    return request({
        baseURL: 'https://pre.z1mobile.com/api/v2/user',
        method: 'POST',
        data: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${token}`,
        }
    })
}

const getWallets = (payload) => {
    const token = localStorage.getItem('tkn')
    
    return request({
        baseURL: `http://127.0.0.1:8000/api/user/wallets?token=${token}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        params: payload
    })
}

const getWallet = (payload) => {
    const token = localStorage.getItem('tkn')
    return request({
        baseURL: `http://127.0.0.1:8000/api/user/wallet/${payload}?token=${token}&qrcode=1`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

const getTransactions = (payload, url = '', query = '') => {
    const token = localStorage.getItem('tkn')
    return request({
        baseURL: url ? url : `http://127.0.0.1:8000/api/user/wallet-transactions?token=${token}&wallet_gid=${payload}${query}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

const getTransaction = (payload) => {
    const token = localStorage.getItem('tkn')
    return request({
        baseURL: `http://127.0.0.1:8000/api/user/wallet-transaction/${payload}?token=${token}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

const createWallet = (payload) => {
    const token = localStorage.getItem('tkn')
    
    return request({
        baseURL: `http://127.0.0.1:8000/api/user/wallet/create?token=${token}`,
        method: 'POST',
        data: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

const createTransaction = (payload) => {
    const token = localStorage.getItem('tkn')
    
    return request({
        baseURL: `http://127.0.0.1:8000/api/user/wallet-transaction/create?token=${token}`,
        method: 'POST',
        data: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

const getWalletTypes = () => {
    const token = localStorage.getItem('tkn')
    
    return request({
        baseURL: `http://127.0.0.1:8000/api/get-wallet-types?token=${token}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

const getCurrencyTypes = () => {
    const token = localStorage.getItem('tkn')
    return request({
        baseURL: `http://127.0.0.1:8000/api/get-currencies?token=${token}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export { updateUser, verifyUser, serviceToken, login, getWallets, getWallet, getTransactions, getTransaction, createTransaction, createWallet, getWalletTypes, getCurrencyTypes }