import React, {useState} from 'react';
//import { post } from '../server/Router/test';
//import GetApiData from './GetApiData';
import MapContainer from './MapContainer';
import './css/MapContainer.css';

function DataMap(){

}

const SearchPlace = () => {
    const [inputText, setText] = useState("");
    const [place, setPlace] = useState("");

    //const [apiData, setApiData] = useState([]);
    const [dataMap, setDataMap] = useState([]);

    const onChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setPlace(inputText);
        setText("");

        var aplace = inputText.replace(/ /gi, "_");
        var uri = encodeURI(`http://openapi.foodsafetykorea.go.kr/api/6feee3b238ed4706a230/C004/json/1/500/ADDR=${aplace}/`);
        console.log(uri);

        fetch(uri)
        .then((res)=>res.json())
        .then(data=>{
            setDataMap(data.C004.row.map((item)=>
                <DataMap key={item.WRKR_REG_NO} place={item.BSSH_NM} value={item.HG_ASGN_LV} address={item.ADDR} />
            ));
        })
        /*
        .then(data=>setApiData(data));

        console.log(apiData);
        setDataMap(apiData.C004.row.map((item) =>
            <DataMap key={item.WRKR_REG_NO} place={item.BSSH_NM} value={item.HG_ASGN_LV} address={item.ADDR}/>
        ));*/
    };
    
    return(
        <div>
            <form class="inputForm" onSubmit={handleSubmit}>
                <input class="input" placeholder="Search Place..." onChange={onChange} value={inputText} />
                <button type="submit">검색</button>
            </form>
            <MapContainer apiData={dataMap} searchPlace={place} />
        </div>
    );

};

export default SearchPlace;