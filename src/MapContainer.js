import React, {useEffect, useState} from 'react';
import './css/MapContainer.css';

const {kakao} = window;

function MapContainer({apiData, searchPlace}) {

    const [Places,setPlaces] = useState([]);
    const [match, setMatch] = useState(true);

    const openPlace = [];
    
    useEffect(()=>{

        // 지도 표시
        const container = document.getElementById('Map');
        const options = {
            center: new kakao.maps.LatLng(37.557523, 126.998186),
            level: 3
        };

        const map = new kakao.maps.Map(container, options);
        const ps = new kakao.maps.services.Places();

        // 우측 상단에 map control 추가
        var mapTypeControl = new kakao.maps.MapTypeControl();
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        var asearchPlace = searchPlace + " 맛집";

        var searchOption1 = {
            page: 2
        };

        var searchOption2 = {
            page: 3
        }

        ps.keywordSearch(asearchPlace, placesSearchCB);
        ps.keywordSearch(asearchPlace, placesSearchCB, searchOption1);
        ps.keywordSearch(asearchPlace, placesSearchCB, searchOption2);

        function placesSearchCB(data, status, pagination){
            if(status === kakao.maps.services.Status.OK){
                let bounds = new kakao.maps.LatLngBounds();

                //console.log(data);

                for(let i=0; i<data.length; i++){
                    for(var j=0; j<apiData.length; j++){

                        // openapi data에서 도로명 주소 가져와서 자르기
                        var tmp = apiData[j].props.address; // 경기도 시흥시 승지로 60번길 36(능곡동)
                        var tmp_addr1 = tmp.indexOf('(');
                        var tmp_addr = apiData[j].props.address.slice(0, tmp_addr1); // 경기도 시흥시 승지로 60번길 36
                        var tmp_addr2 = tmp_addr.indexOf(' ');
                        var tmp_addr_after = tmp_addr.slice(tmp_addr2+1, ); // 시흥시 승지로 60번길 36 

                        // kakao map api data에서 도로명 주소 가져와서 자르기
                        var data_tmp = data[i].road_address_name; 
                        var data_tmp1 = data_tmp.indexOf(' ');
                        var data_tmp_after = data_tmp.slice(data_tmp1+1, );
                            
                        if(tmp_addr_after === data_tmp_after){

                            // kakao api place name
                            var temp = data[i].place_name.indexOf(' ');
                            var temp1 = data[i].place_name.slice(0, temp);

                            // openapi place name
                            var tempa = apiData[j].props.place;

                            var count = 0;

                            for(var k=0;k<temp1.length;k++){
                                if(temp1[k]===tempa[k]) count = count+1;
                            }

                            if((count/temp1.length) > 0.5){
                                displayMarker(data[i], apiData[j].props.value);
                                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x)); // 위도, 경도 재설정
                                openPlace.push(data[i]);
                                setMatch(false);
                                //console.log(match);
                            }
                        }
                    }
                    //console.log(match);
                    if(match) bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }

                let result = [...new Set(openPlace)];

                map.setBounds(bounds);
                //displayPagination(pagination);
                setPlaces(result);

            } else if(status === kakao.maps.services.status.ERROR){

                alert('오류 발생');
                return;

            } else if(status === kakao.maps.services.status.ZERO_RESULT){

                alert('검색결과가 존재하지 않습니다');
                return;

            }
        }

        // 마커 생성
        function displayMarker(place, grade){
            let marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });

            // 커스텀 오버레이 생성
            displayOverlay(marker, place, grade);
        }

        function displayOverlay(marker, place, grade){

            let overlay;
            var content = `<div class="wrap" style="position: absolute;left: 0;bottom: 40px;width: 288px;height: 150px;margin-left: -144px;text-align: left;overflow: hidden;font-size: 12px;font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;line-height: 1.5;">
                               <div class="info" style="width: 286px;height: 140px;border-radius: 5px;border-bottom: 2px solid #ccc;border-right: 1px solid #ccc;overflow: hidden;background: #fff;">
                                   <div class="title" style="padding: 5px 0 0 10px;height: 50px;background: #eee;border-bottom: 1px solid #ddd;font-size: 18px;font-weight: bold;">
                                   <div>${place.place_name}</div>
                                    <div style="float:right;margin:5px 10px 0 0;font-size:12px;font-color:red;">위생등급:  ${grade}</div>
                                   </div>
                                   <div class="body" style="position: relative;overflow: hidden;">
                                       <div class="img" style="position: absolute;top: 6px;left: 5px;width: 73px;height: 71px;border: 1px solid #ddd;color: #888;overflow: hidden;">
                                           <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70" />
                                       </div>
                                       <div class="desc" style="position: relative;margin: 13px 0 0 90px;height: 75px;">
                                            <div class="ellipsis" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">주소)${place.address_name}</div>
                                            <div class="jibun" style="font-size: 11px;color: #888;margin-top: -2px;">지번)${place.road_address_name}</div>
                                            <button type="button" onClick="window.location.href='http://localhost:3000/findPeopleWith/${place.place_name}/${grade}'" style="margin:5px 0px 0px 10px;height:25px;width:150px;">같이 먹을사람 찾기</button>
                                       </div>
                                   </div>
                               </div>
                            </div>`;

            // 마커 클릭하면 음식점 세부정보 오버레이 생성
            kakao.maps.event.addListener(marker, 'click', function(){
                overlay = new kakao.maps.CustomOverlay({
                    content: content,
                    map: map,
                    position: marker.getPosition()
                });
            });

            // 마커에서 마우스오버하면 세부정보 오버레이 없어짐
            kakao.maps.event.addListener(marker, 'mouseover', function(){
                overlay.setMap(null);
            })

        }
        
    }, []);

    return(
        <div class="body" id="body">
            <div class="result">
                {Places.map((item, i) => (
                    <div key={i} class="item">
                        <div class="first">
                            <div>{i+1}</div>
                        </div>
                        <div class="second">
                            <div class="firstb">{item.place_name}</div>
                            <div>주소) {item.address_name}</div>
                            <div>지번) {item.road_address_name}</div>
                            <div>Tel) {item.phone}</div>
                        </div>
                    </div>
                ))}
            </div>            
            <div id='Map' class="Map"></div>
        </div>
    );
}

export default MapContainer;