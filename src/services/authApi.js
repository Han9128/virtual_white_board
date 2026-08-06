import { BASE_URL } from '../constants/constants'

export async function registerUser(payload) {
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json();
        if (!res.ok) {
            if (data.message) {
                throw new Error(data.message)
            } else {

                throw new Error(data.errors[0].msg)
            }
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function authenticateLogin(payload) {
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            throw new Error(`Error in log in, status ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function verifyToken(token) {
    try {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error(`Error in token verification ${res.status}`)
        }

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message)
    }
}

