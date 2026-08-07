
import {BASE_URL} from "../constants/constants";


export async function getCanvases(token){
    try{
        const res = await fetch(`${BASE_URL}/canvas/list`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            }
        })

        const data = await res.json();
        if(!res.ok){
            throw new Error(data)
        }

        return data;
    }catch(err){
        throw new Error(err.message)
    }
}


