
import React,{useContext, useEffect, useState} from "react";
import authContext from "../../store/auth-context"
import classes from "./index.module.css"
import {getCanvases} from "../../services/canvasApi"
import Canvas from "./Canvas"

function Dashboard(){

    const {userData} = useContext(authContext)
    const [canvases,setCanvases] = useState([]);
    const [loader,setLoader] = useState("Loading...")

    useEffect(()=>{
        const fetchCanvas = async ()=>{
            const token = localStorage.getItem('token');
            try{
                const data = await getCanvases(token);
                setCanvases(data.canvases)
                
            }catch(err){
                console.error(err);
            }finally{
                setLoader("")
            }
        }

        fetchCanvas();
    },[])


    return (
       loader? <p className={classes.dashLoader}>{loader}</p>: <div className={classes.dashBoardBackground}>
            <div className={classes.dashBoardContainer}>

                <div className={classes.navBar}>
                    <h3>Welcome {userData.name}</h3>
                </div>

                <div className={classes.contents}>
                    {canvases.length===0?<p className={classes.noCanvas}>No Canvas Found!</p>:canvases.map((canvas)=>{
                        return (<Canvas key={canvas._id} canvas={canvas} />)
                    })}
                </div>
                <div className={classes.dashFooter}>
                    <button type="submit">Create</button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard