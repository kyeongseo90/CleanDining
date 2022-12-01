const express = require('express');
const app = express();
const cors = require('cors');
// cors 모듈
const getData = require('./GetApiData.js');

app.use(cors({
    origin: "http://localhost:3000"
}));

app.get('/keywordSearch', async(req, res) => {
    const {address} = req.query;
    await getData(address, (error, data)=>{
        if(error){
            res.send(error);
        }else{
            console.log('프록시 서버에서:', data)
            res.send(data)
        }
    })
})

const port = 5000;
app.listen(port, ()=>{console.log(`Listening port on ${port}`)});