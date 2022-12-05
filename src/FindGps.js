import React, {useEffect, useState} from 'react';
import FindGpsApi from './FindGpsApi.js';
//import FindGpsResult from './FindGpsResult.js';
import Loading from './Loading.js';
import './css/FindGps.css';
import WatchDetailInfo from './WatchDetailInfo.js';

const {kakao} = window; 

const FindGps = () => {

    const [Places, setPlaces] = useState([]);
    const [addr, setAddr] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longtitude, setLongtitude] = useState(null);
    const [loading, setLoading] = useState(true);
    //const [count, setCount] = useState(0);

    useEffect (()=>{

        //console.log("1");

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
    
                //var locPosition = new kakao.maps.LatLng(lat,lon),
                //    message = `<div style="padding:5px;">현재 위치</div>`;
    
                setLatitude(lat);
                setLongtitude(lon);
    
                //console.log(lon, lat);
    
                //displayGpsMarker(locPosition, message); // 마커
            });
        } else {
            var locPosition = new kakao.maps.LatLng(37.557523, 126.998186), // gps 허용이 안될때, 기본주소 충무로
                message = '<div style="padding:5px;">geolocation을 사용할 수 없어요..</div>';
    
            // displayGpsMarker(locPosition, message);
        }
    
        // 주소-좌표 객체 생성
        var geocoder = new kakao.maps.services.Geocoder();
    
        var callback = function(result, status){
            if(status === kakao.maps.services.Status.OK){
                for(var i=0;i<result.length;i++){
                    if(result[i].region_type==='B'){
                        setAddr(result[i].address_name);
                    }
                }
            }
        }
    
        geocoder.coord2RegionCode(longtitude, latitude, callback);
    
        const ps = new kakao.maps.services.Places();
    
        var detailAddr = addr + ' 맛집';
    
        ps.keywordSearch(detailAddr, placesSearchCB);
    
        function placesSearchCB(data, status, pagination){
            if(status === kakao.maps.services.Status.OK){

                //console.log(data);
                address_duplicate(data);
                
            } else if(status === kakao.maps.services.status.ERROR){
    
                alert('오류 발생');
                return;
    
            } else if(status === kakao.maps.services.status.ZERO_RESULT){
    
                alert('검색결과가 존재하지 않습니다');
                return;
    
            }
        }
    
        function address_duplicate(data){
    
            var search_tmp = [];
    
            for(var i=0; i<data.length; i++){
                var tmp = data[i].road_address_name;
                var tmp1 = tmp.indexOf('로');
                var tmp2 = tmp.indexOf(' ');
                var tmp3 = tmp.slice(tmp2+1, tmp1+1);
                search_tmp.push(tmp3);
            }
    
            let search = [...new Set(search_tmp)];

            setPlaces(search);
        }
        
        if(addr!==""){
            setLoading(false);
        }

    }, [addr, latitude, longtitude, Places]);

    return(
        <>
        {
            loading ? <Loading /> :
            <FindGpsApi addr={Places} printAddr={addr} />
        }
        </>
    );
    
}

export default FindGps;