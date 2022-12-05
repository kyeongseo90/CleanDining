const http = require("http");
const express = require("express");
const path = require("path");

const app = express();

const port = 3000; //인스턴스 생성시 만들었던 포트번호 기입

app.get("/ping", (req, res) => {
	res.send("pong");
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
	res.set({
		"Cache-Control": "no-cache, no-store, must-revalidate",
		Pragma: "no-cache",
		Date: Date.now()
	});
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

http.createServer(app).listen(port, () => {console.log(`app listening at ${port}`);});

/*
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
*/
