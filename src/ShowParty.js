import React from "react";
import { useParams } from "react-router-dom";

function ShowParty(){

    const { id } = useParams();

    return(
        <div>{id}</div>
    );
}

export default ShowParty;