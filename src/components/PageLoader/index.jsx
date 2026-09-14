import React from "react";
import classes from "./index.module.css";
import {Presentation} from "lucide-react";

function PageLoader() {

    return (
        <div className={classes.pageLoader}>
            <div className={classes.loaderMark}>
                <Presentation />
            </div>
            <p className={classes.loaderText}>
                Loading your canvases <span>.</span> <span>.</span> <span>.</span>
            </p>
        </div>
    )
}

export default PageLoader;