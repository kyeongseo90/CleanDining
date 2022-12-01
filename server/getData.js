const fetch = require('node-fetch');
//const serviceKey = ''

const getData = (address, callback) => { 
    const url = `http://openapi.foodsafetykorea.go.kr/api/6feee3b238ed4706a230/C004/json/1/500/ADDR=${address}/`;
    fetch(address, {method: 'GET'})
    .then((res)=>res.json())
    .then((data)=>{
        const getData = data.body.items
        callback(undefined, getData)
    })
    .catch((error)=>{
        console.log('에러 발생', error)
        callback(error)
    })
}

module.exports = getData