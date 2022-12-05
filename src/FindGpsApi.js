import React, {useState} from 'react';
import FindGpsResult from './FindGpsResult';
import Loading from './Loading';
import './css/FindGps.css';
import WatchDetailInfo from './WatchDetailInfo';

//const {kakao} = window;

function DataMap() {

}

const FindGpsApi = ({addr, printAddr}) => {

    const [dataMap, setDataMap] = useState([]);
    const [searchPlace, setSearchPlaces] = useState([]);
    const [loading, setLoading] = useState(false);

    //console.log(addr);

    const handleClick = (event) => {
        event.preventDefault();
        
        setSearchPlaces(addr);
        
        for(var i=0; i<searchPlace.length; i++){
            callApi(searchPlace[i]);
        }
        
    }

    const callApi = async (uri) => {
        setLoading(true);
        try {

            var gps = uri.replace(/ /gi, "_");
            var current_uri = encodeURI(`http://openapi.foodsafetykorea.go.kr/api/ef03c3ddff5742b7bf91/C004/json/1/500/ADDR=${gps}`);
            
            const response = await fetch(current_uri);
            const result = await response.json();

            setDataMap(result.C004.row.map((item) =>
                <DataMap key={item.LCNS_NO} place={item.BSSH_NM} value={item.HG_ASGN_LV} address={item.ADDR} />
            ));

            //console.log(result);

            setLoading(false);
        } catch (error) {
            //window.alert(error);
            //setLoading(false);
        }
    }

    return (
        <div>
            <div class="top">
                <div class="top_info">현재위치: {printAddr}</div>
                <button class="top_btn" onClick={handleClick}>음식점 검색하기</button>
            </div>
            {loading ? <Loading /> : <FindGpsResult data={dataMap}/>}
        </div>
    );
}

export default FindGpsApi;