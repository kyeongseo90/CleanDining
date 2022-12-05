import React, {useState} from 'react';
import MapContainer from './MapContainer.js';
import Loading from './Loading.js';
import './css/SearchPlace.css';

function DataMap(){

}

const SearchPlace = () => {
    const [inputText, setText] = useState("");
    const [place, setPlace] = useState("");
    const [dataMap, setDataMap] = useState([]);
    const [loading, setLoading] = useState(false);

    const onChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setPlace(inputText);
        setText("");

        var aplace = inputText.replace(/ /gi, "_");
        var uri = encodeURI(`http://openapi.foodsafetykorea.go.kr/api/ef03c3ddff5742b7bf91/C004/json/1/500/ADDR=${aplace}`);

        callApi(uri);
    };

    const callApi = async (uri) => {
        setLoading(true);
        try {
                
            const response = await fetch(uri);
            const result = await response.json();

            setDataMap(result.C004.row.map((item) =>
                <DataMap key={item.WRKR_REG_NO} place={item.BSSH_NM} value={item.HG_ASGN_LV} address={item.ADDR} />
            ));

            if(dataMap === null || dataMap === undefined) throw new Error("retry");

            setLoading(false);
        } catch (error) {
            window.alert(error);
            setLoading(false);
        }
    }

    return(
        <div>
            <div class="search-bar">
                <form class="inputForm" onSubmit={handleSubmit}>
                    <input class="input" placeholder="검색해보세요... [Ex) 경기도 시흥시 승지로]" onChange={onChange} value={inputText} />
                    <button class="search" type="submit">Search</button>
                </form>
            </div>
            {loading ? <Loading /> : <MapContainer apiData={dataMap} searchPlace={place} />}
        </div>
    );

};

export default SearchPlace;