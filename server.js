

const http = require("http");
const express = require("express");
const path = require("path");

const app = express();

const port = 3000; //인스턴스 생성시 만들었던 포트번호 기입

//
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/addParty", (req,res)=> {
    var connection = mysql.createConnection({
        host: "localhost",
        user: "serverDBManager",
        password: "0000",
        database: "dining",
        port: 3306
    });

    connection.connect();
	const license = req.body.license;
	const title = req.body.title;
    const partydate = req.body.date;
	const brief = req.body.briefInfo;
    const number = req.body.gather_num;
	const content = req.body.content;
	const due = req.body.duedate;
    
    //console.log(partydate, number, license);
    connection.query("INSERT INTO findPeople(license_id, title, date, briefInfo, gather_num, content, dueDate) values (?,?,?,?,?,?,?)", 
	[license, title, partydate, brief, number, content, due], function(err,rows){
        if(err) throw err;
        else{
            console.log("insert");
            //res.send("success");
        }
    });
})

app.post("/addReview", (req,res)=> {
    var connection = mysql.createConnection({
        host: "localhost",
        user: "serverDBManager",
        password: "0000",
        database: "dining",
        port: 3306
    });

    connection.connect();
	const license = req.body.license;
	const title = req.body.title;
    const visitdate = req.body.visitDate;
    const grade = req.body.grade;
	const content = req.body.content;
    
    //console.log(partydate, number, license);
    connection.query("INSERT INTO review(license_id, title, date, grade, content) values (?,?,?,?,?)", 
	[license, title, visitdate, grade, content], function(err,rows){
        if(err) throw err;
        else{
            console.log("insert");
            //res.send("success");
        }
    });
})

app.get("/getPartyData", (req,res)=>{
	var connection = mysql.createConnection({
		host : "localhost",
		user : "serverDBManager", //mysql의 id
		password : "0000", //mysql의 password
		database : "dining", //사용할 데이터베이스
		port : 3306
	});
	connection.connect();
	const value = req.query.key;
	console.log(value);
	connection.query("SELECT * FROM findPeople WHERE license_id = ?", [value], function(err,data){
		if(err) throw err;
		else{
			console.log("get");
			res.send(data);
		}
	});
})

app.post("/addMember", (req,res)=> {
	console.log("Start Add Memeber");
	var connection = mysql.createConnection({
		    host : "localhost",
		    user : "serverDBManager", //mysql의 id
		    password : "0000", //mysql의 password
		    database : "dining", //사용할 데이터베이스
		    port : 3306
	});
	connection.connect();
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	connection.query("SELECT * FROM users WHERE email = ?", [email], function(err, rows){
		if(err) throw err;
		else if(rows.length){
			res.send("Already");
		}
		else {
			connection.query("INSERT INTO users(email, name, password) values (?,?,?)", [email, name, password], function (err, rows){
				if(err) throw err;
				else {
					console.log("1 record inserted");
					res.send("Success");
				}
			});
		}
		connection.end();
	});    
})
//
app.post("/loginVerify", (req, res) =>{
	    console.log("Start Login Verify");
	    var connection = mysql.createConnection({
		            host : "localhost",
		            user : "serverDBManager", //mysql의 id
		            password : "0000", //mysql의 password
		            database : "dining", //사용할 데이터베이스
		            port : 3306
		        });
	    connection.connect();
	    const email = req.body.email;
	    const password = req.body.password;
	    console.log("email:");
	    console.log(email);
	    console.log("password");
	    console.log(password);
            connection.query("SELECT email, password FROM users WHERE email = ?", [email], function(err, rows){
		    if(err) throw err;
		    else if(rows.length){
			    console.log("Get Rows");
			    if(rows[0].password == password){
				    res.send("ERROR1");
			    }
			    else {                
			            res.send("ERROR2");
			    }
		    }
		    else{
			    res.send("ERROR3");
		    }
		    connection.end();
	     })
});

app.get("/ping", (req, res) => {
	  res.send("pong");
	console.log("/ping CALLED");
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

http.createServer(app).listen(port, () => {
	  console.log(`app listening at ${port}`);
});