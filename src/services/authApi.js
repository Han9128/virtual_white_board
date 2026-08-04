import {BASE_URL} from '../constants/constants'

export async function authenticateLogin(payload){
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

