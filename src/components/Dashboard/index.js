
import {useContext, useEffect, useState} from "react";
import {Plus, Presentation, LogOut} from 'lucide-react';
import authContext from "../../store/auth-context"
import classes from "./index.module.css"
import {getCanvases, createCanvas} from "../../services/canvasApi";
import {fetchProfile} from "../../services/authApi"
import Canvas from "./Canvas";
import PageLoader from "../../components/PageLoader/index";
import {useNavigate} from "react-router";

function Dashboard(){

    const {logout} = useContext(authContext)
    const [userData, setUserData] = useState(null);
    const [canvases,setCanvases] = useState([]);
    const [loader,setLoader] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchProfileAndCanvas = async ()=>{
            
            try{
                const [profile,canvases] = await Promise.all([fetchProfile(token),getCanvases(token)])
                setUserData(profile);
                setCanvases(canvases.canvases)
                
            }catch(err){
                if(err.status === 401){
                    logout();
                }
                console.error(err);
            }finally{
                setLoader(false);
            }
        }

        fetchProfileAndCanvas();
    },[token])

    useEffect(()=>{
        const handleScroll = ()=>{
            setScrolled(window.scrollY>60);
        };

        window.addEventListener('scroll',handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); 
    }, [])


    const handleCreateCanvas = async ()=>{
        
        try{
            const name = `Untitled ${canvases.length+1}`
            const data = await createCanvas(token,name);
            navigate(`/canvas/${data.canvasId}`);
            return data;
        }catch(err){
            console.error(err);
        }
    }

    const handleDeleteCanvas = (id)=>{
        setCanvases((prevCanvases)=>prevCanvases.filter((canvas)=> canvas._id!==id))
    }



    const handleLogout = () => {
        logout();
    }

    const capitalize = (str) => str? str.charAt(0).toUpperCase() + str.slice(1):str; 

    const handleProfileClick = ()=>{
        setOpenDrawer(!openDrawer);
    }

    return (
       loader? <PageLoader/>: 
       <div className={classes.dashBoardBackground}>
            <div className={classes.dashBoardContainer}>

                <div className={classes.navbarBackdrop}>
                    <div className={`${classes.navBar} ${scrolled? classes.navbarScrolled:''}`} >
                    <div className={classes.brand}>
                        <div className={classes.brandMark}>
                            <Presentation />
                        </div>
                    <h2 className={classes.logo}>Whiteboard</h2>
                    </div>
                    <div className={classes.profileContainer}>
                    <button className={classes.avatar} onClick={handleProfileClick}>{userData?.name?userData.name.slice(0,2).toUpperCase():'WB'}</button>
                    {openDrawer && 
                    (
                        <>
                    <div className={classes.drawerBackdrop} onClick={()=>setOpenDrawer(false)}></div>
                        <div className={classes.profileDrawer}>
                        <div className={classes.profileInfo}>
                            <div className={classes.avatar}>
                                {userData.name?userData.name.slice(0,2).toUpperCase():'WB'}
                            </div>
                            <div className={classes.userInfo}>
                                <strong className={classes.name}>{userData? capitalize(userData.name): "Creator"}</strong>
                                <p className={classes.email}>{userData? userData.email: "creator@gmail.com"}</p>
                            </div>
                        </div>
                        <div className={classes.logoutContainer} onClick={handleLogout}>
                            < LogOut size={16}/>
                            {/* type="submit" alwasy submits a form so if a button is not menat to submit a form give its type just button */}
                    <button type="button" className={classes.logout} >Log out</button>
                </div>
                    </div>
                    </>)}
                    </div>
                </div>
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
                                <strong className={classes.name}>{userData? capitalize(userData.name): "Creator"}</strong>
                                <p className={classes.email}>{userData? userData.email: "creator@gmail.com"}</p>
                            </div>
                        </div>
                            <div className={classes.statusDot}>
                                <i></i>
                                Synced
                            </div>
                    </div>
                </div>

                <div className={classes.canvasSection}>
                    <div className={classes.header}>
                        <h2>Your Canvases <span className={classes.countChip}>{canvases.length}</span></h2>
                        <button className={classes.newBtn} onClick={handleCreateCanvas}><Plus/> 
                        <span className={classes.createCanvasTxt}>Create Canvas</span></button>
                    </div>

                    {canvases.length===0?
                    <div className={classes.noCanvasSection}>
                    <h2 className={classes.noCanvas}>No Canvas Found!</h2>
                    <div className={classes.newCard} onClick={handleCreateCanvas}>
                        <div className={classes.plusRing}>
                            <Plus />
                        </div>
                        <span>Create a new Canvas</span>
                    </div>
                    </div>:
                    <div className={classes.canvasGrid}>

                    {canvases.map((canvas)=>{
                        return (<Canvas key={canvas._id} canvas={canvas} token={token} onDelete={handleDeleteCanvas} />)
                    })}
                    </div>}
                </div>
                </div>
                
            </div>
        </div>
    )
}

export default Dashboard