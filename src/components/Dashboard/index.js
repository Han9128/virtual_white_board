
import React,{useContext, useEffect, useState} from "react";
import {Plus, Presentation} from 'lucide-react';
import authContext from "../../store/auth-context"
import boardContext from "../../store/board-context";
import classes from "./index.module.css"
import {getCanvases, createCanvas} from "../../services/canvasApi"
import Canvas from "./Canvas"

function Dashboard(){

    const {userData, setShowDashboard} = useContext(authContext)
    const {loadCanvasHandler,setCanvasId} = useContext(boardContext);
    const [canvases,setCanvases] = useState([]);
    const [loader,setLoader] = useState("Loading...");

    const token = localStorage.getItem('token');
    useEffect(()=>{
        const fetchCanvas = async ()=>{
            
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
    },[token])


    const handleCreateCanvas = async ()=>{
        
        try{
            const name = `Untitled ${canvases.length+1}`
            const data = await createCanvas(token,name);
            setShowDashboard(false);
            return data;
        }catch(err){
            console.error(err);
        }
    }

    const handleDeleteCanvas = (id)=>{
        setCanvases((prevCanvases)=>prevCanvases.filter((canvas)=> canvas._id!==id))
    }

    const handleLoadCanvas = (id,elements) => {
        setCanvasId(id);
        loadCanvasHandler(elements);
        setShowDashboard(false);
    }
    const capitalize = (str) => str? str.charAt(0).toUpperCase() + str.slice(1):str; 


    return (
       loader? <p className={classes.dashLoader}>{loader}</p>: 
       <div className={classes.dashBoardBackground}>
            <div className={classes.dashBoardContainer}>

                <div className={classes.navBar}>
                    <div className={classes.brand}>
                        <div className={classes.brandMark}>
                            <Presentation />
                        </div>
                    <h2 className={classes.logo}>Whiteboard</h2>
                    </div>
                    <button className={classes.avatar}>{userData.name?userData.name.slice(0,2).toUpperCase():'WB'}</button>
                </div>


                <div className={classes.contents}>
                <div className={classes.welcomeSection}>
                    <div className={classes.welcomeMessage}>
                        <h1>Welcome Back, {userData? capitalize(userData.name): "Creator"}</h1>
                        <p>Your creative workspace - pick up a canvas or start something new</p>
                    </div>

                    <div className={classes.profileCard}>
                        <div className={classes.profileInfo}>
                            <div className={classes.avatar}>
                                {userData.name?userData.name.slice(0,2).toUpperCase():'WB'}
                            </div>
                            <div className={classes.userInfo}>
                                <h4 className={classes.name}>{userData? capitalize(userData.name): "Creator"}</h4>
                                <h4 className={classes.email}>{userData? userData.email: "creator@gmail.com"}</h4>
                            </div>
                            <div className={classes.statusDot}>
                                <i></i>
                                Synced
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classes.canvasSection}>
                    <div className={classes.header}>
                        <h4>Your Canvases</h4>
                        <button onClick={handleCreateCanvas}><span><Plus/></span> Create Canvas</button>
                    </div>

                    <div className={classes.canvasGrid}>

                    {canvases.length===0?
                    <div className={classes.noCanvasSection}>
                    <h2 className={classes.noCanvas}>No Canvas Found!</h2>
                    <button className={classes.createBtn} onClick={handleCreateCanvas}>Create</button>
                    </div>:
                    canvases.map((canvas)=>{
                        return (<Canvas key={canvas._id} canvas={canvas} token={token} onDelete={handleDeleteCanvas} onLoad={handleLoadCanvas} />)
                    })}
                    </div>
                </div>
                </div>
                <div className={classes.dashFooter}>
                    <button type="submit" className={classes.createBtn} onClick={handleCreateCanvas}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard