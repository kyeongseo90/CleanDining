import React from 'react';
import { useParams } from 'react-router-dom';
import './css/FindPeopleWith.css';
//import { BrowserRouter, Routes,Route } from 'react-router-dom';

function FindPeopleWith(){
    
    // 음식점 id value
    const { id, grade } = useParams();

    const handleClick = (data, event) => {
        event.preventDefault();
        window.location.href = `http://localhost:3000/watchDetailInfo/${data}`;
    }

    const handleCreate = (data, event) => {
        event.preventDefault();
        window.location.href = `http://localhost:3000/createNewParty/${data}`;
    }

    const handleMove = (data, event) => {
        event.preventDefault();
        window.location.href = `http://localhost:3000/showParty/${data}`;
    }   

    return(
        <div className="whole">
            <div className="logo"><img src="./assets/logo.png" /></div>
            <div className="top">
                <div>
                    <div className="id">{id}</div> 
                    <div>위생등급: {grade}</div>
                </div>
                <button onClick={(event) => handleClick(id, event)}>음식점 세부정보 보기</button>
            </div>
            
            <button className="createBtn" onClick={(event) => handleCreate(id, event)}>새로운 파티 만들기</button>
            
            <div className="bottom">
                <div className="party">파티 리스트</div>
                <div>
                    <ul>
                        <li><button onClick={(event) => handleMove(id, event)}>1</button></li>
                        <li>2</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default FindPeopleWith;