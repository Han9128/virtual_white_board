
import { useState} from "react";
import classes from "./index.module.css";
import { Share2,Trash} from "lucide-react";
import { deleteCanvas} from "../../services/canvasApi";
import {useNavigate} from "react-router";

function Canvas({ canvas, token, onDelete, onShare}) {

   
    const [deleteError, setDeleteError] = useState("");
    const navigate = useNavigate();

    const findEditDuration = () => {
        let seconds = (new Date() - new Date(canvas.modifiedAt)) / 1000;
        const day = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        const hour = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minute = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (day > 0) {
            return `${day}d`;
        } else if (hour > 0) {
            return `${hour}h`
        } else if (minute > 0) {
            return `${minute}m`
        }

        return `${seconds}s`
    }

    const handleDelete = async (id) => {
        try {
            const data = await deleteCanvas(token, id);
            onDelete(id);
            return data;
        } catch (err) {
            setDeleteError(err.message);
            console.error(err.message);
        }
    }

    const handleCardClick = async (id) => {
            navigate(`/canvas/${id}`);
    }


    


    return (
       
            <div className={classes.canvasCard} >
                <div className={classes.topPart} onClick={() => handleCardClick(canvas._id)}>
                    <p className={classes.share} onClick={(e) => {e.stopPropagation(); onShare(canvas._id)}}><Share2 size={13}/> Share</p>
                </div>
                <div className={classes.bottomPart}>
                    <div className={classes.canvasInfo}>
                        <h3 className={classes.canvasName}>{canvas.name || 'Canvas'}</h3>
                    <button
                        className={classes.deleteCanvas}
                        style={deleteError ? {display:'none'}:{}}
                        onClick={(e) => {e.stopPropagation();handleDelete(canvas._id, canvas.elements)}}
                    ><Trash size={16}/>
                    </button>
                    {deleteError && <p className={classes.deleteError}>{deleteError}</p>}
                    </div>
                    <div className={classes.canvasMeta}>
                        Edited <span className={classes.editDuration}><b>{findEditDuration()}</b></span> ago
                    </div>
                </div>
            </div >

    )
}

export default Canvas;