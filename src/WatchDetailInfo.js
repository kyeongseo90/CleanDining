import React from "react";
import { useParams } from "react-router-dom";

function WatchDetailInfo(){

    const {id} = useParams();
    
    console.log();

    return(
        <div>
            {id}
        
        </div>
    );
}

export default WatchDetailInfo;