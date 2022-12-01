import React, {useEffect, useState} from 'react';
import './css/FindGps.css';

const {kakao} = window; 

const FindGps = () =>{

    const [Places, setPlaces] = useState([]);

    useEffect(()=>{

        if(navigator.geolocation){

            navigator.geolocation.getCurrentPosition(function(position){
                var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
    
                var locPosition = new kakao.maps.LatLng(lat,lon),
                    message = '<div style="padding:5px;">여기에 계신가요?!</div>';
    
                displayGpsMarker(locPosition, message);
            });
        } else {
            var locPosition = new kakao.maps.LatLng(37.557523, 126.998186), // gps 허용이 안될때, 기본주소 충무로
                message = 'geolocation을 사용할 수 없어요..';
    
            displayGpsMarker(locPosition, message);
        }

        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3
        }

        const map = new kakao.maps.Map(container, options);
        const ps = new kakao.maps.services.Places();

        // 우측 상단에 map control 추가
        var mapTypeControl = new kakao.maps.MapTypeControl();
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 주소-좌표 객체 생성
        var geocoder = new kakao.maps.services.Geocoder();

        var marker = new kakao.maps.Marker(),
            infowindow = new kakao.maps.InfoWindow({zindex:1});

        // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);

        // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트 등록
        kakao.maps.event.addListener(map, 'click', function(mouseEvent){
            searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status){
                if(status === kakao.maps.services.Status.OK){

                    var detailAddr = !!result[0].road_address ? '<div>도로명주소 : '+result[0].road_address.address_name+'</div>':'';
                    detailAddr = '<div>지번 주소 : '+result[0].address.address_name+'</div>';

                    var content = '<div class="bAddr">'+
                                    '<span class="title">법정동 주소정보</span>'+
                                    detailAddr +
                                    '</div>';

                    marker.setPosition(mouseEvent.latLng);
                    marker.setMap(map);

                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                }
            })
        });

        // 중심 좌표나 확대 수준이 변경되었을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트 등록
        kakao.maps.event.addListener(map, 'idle', function(){
            searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        })
        
        // 좌표로 행정동 주소 정보를 요청
        function searchAddrFromCoords(coords, callback){
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
        }

        // 좌표로 법정동 주소 정보를 요청
        function searchDetailAddrFromCoords(coords, callback){
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

        // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수
        function displayCenterInfo(result, status){
            if(status === kakao.maps.services.Status.OK){
                var infoDiv = document.getElementById('centerAddr');

                for(var i=0; i<result.length; i++){
                    if(result[i].region_type==='H'){
                        infoDiv.innerHTML = result[i].address_name;
                        break;
                    }
                }
            }
        }

        //ps.keywordSearch(detailAddr, placesSearchCB);

        function placesSearchCB(data, status, pagination){
            if(status === kakao.maps.services.Status.OK){
                let bounds = new kakao.maps.LatLngBounds();

                for(let i=0; i<data.length; i++){
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x)); // 위도, 경도 재설정
                }

                map.setBounds(bounds);

                //displayPagination(pagination);
                setPlaces(data);

            } else if(status === kakao.maps.services.status.ERROR){

                alert('오류 발생');
                return;

            } else if(status === kakao.maps.services.status.ZERO_RESULT){

                alert('검색결과가 존재하지 않습니다');
                return;

            }
        }
    
        function displayGpsMarker(locPosition, message){
            var marker = new kakao.maps.Marker({
                map: map,
                position: locPosition
            });
    
            var iwContent = message,
                iwRemovaeable = true;
    
            var infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
                removable : iwRemovaeable
            });
    
            infowindow.open(map, marker);
    
            map.setCenter(locPosition);
        }

        function displayMarker(place){
            let marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });


        }

    },[]);

    return(
        <div class="map_wrap">
            <div id="map"></div>
            <div class="hAddr">
                <span class="title">지도중심기준 행정동 주소정보</span>
                <span id="centerAddr"></span>
            </div>
        </div>
    );
    
}

export default FindGps;