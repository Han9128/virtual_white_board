
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

    const capitalize = (str) => str? str.charAt(0).toUpperCase() + str.slice(1):str; 


    return (
       loader? <p className={classes.dashLoader}>{loader}</p>: 
       <div className={classes.dashBoardBackground}>
            <div className={classes.dashBoardContainer}>

                <div className={classes.navBar}>
                    <h2 className={classes.logo}>Whiteboard</h2>
                    <button className={classes.profilePicture}>{userData.name?userData.name.slice(0,2).toUpperCase():'WB'}</button>
                </div>


                <div className={classes.contents}>
                <div className={classes.welcomeSection}>
                    <div className={classes.welcomeMessage}>
                        <h3>Welcome Back, {userData? capitalize(userData.name): "Creator"}</h3>
                        <h4>Your creative workspace</h4>
                    </div>

                    <div className={classes.profileCard}>
                        <div className={classes.profileInfo}>
                            <div className={classes.profileAvatar}>
                                {userData.name?userData.name.slice(0,2).toUpperCase():'WB'}
                            </div>
                            <div className={classes.userInfo}>
                                <h4 className={classes.name}>{userData? capitalize(userData.name): "Creator"}</h4>
                                <h4 className={classes.email}>{userData? userData.email: "creator@gmail.com"}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classes.canvasSection}>
                    <div className={classes.header}>
                        <h4>Your Canvases</h4>
                        <button>+ Create Canvas</button>
                    </div>

                    <div className={classes.canvasGrid}>

                    {canvases.length===0?<p className={classes.noCanvas}>No Canvas Found!</p>:canvases.map((canvas)=>{
                        return (<Canvas key={canvas._id} canvas={canvas} />)
                    })}
                    </div>
                </div>
                </div>
                <div className={classes.dashFooter}>
                    <button type="submit" className={classes.createBtn}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard