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

        const data = await res.json().catch(()=>({}));
        if (!res.ok) {
            const error = new Error(data.message || `Request failed (${res.status})`);
            error.status = res.status;
            error.fields = data.fields;
            throw error;
        }

        return data;
    } catch (err) {
        throw err;
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
            const error = new Error(`Error in log in, status ${res.status}`);
            error.status = res.status;
            throw error;
        }
        const token = await res.json();
        return token;
    } catch (err) {
        throw err;
    }
}

export async function fetchProfile(token) {
    try {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!res.ok) {
            const error = new Error(`Error in token verification ${res.status}`);
            error.status = res.status;
            throw error;
        }
        const data = await res.json();
        return data;
    } catch (err) {
        throw err;
    }
}

