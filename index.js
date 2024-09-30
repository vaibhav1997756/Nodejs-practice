const http=require("http");
const fs=require("fs");
const url =require("url");
const express = require('express');


const app=express();

app.get("/",(req,res)=>{
  return res.send("Hello from Home Page");
});
app.get("/about",(req,res)=>{
    return res.send("Hello from About Page");
  });

function myHandler(req,res){
    if(req.url ==="./favicon.ico") return res.end();
    const log=`${Date.now()}:${req.method} ${req.url} New Req Recieved \n`
    const myUrl=url.parse(req.url,true);
    console.log(myUrl);
    fs.appendFile('log.txt',log,(err,data)=>{
        switch(myUrl.pathname){
            case '/': 
            if(req.method ==="GET")
            res.end("HomePage");
            break;

            case '/about': 
            //res.end("I am Vaibhav Singh");
            const user=myUrl.query.myname;
            res.end(`Hi ${user}`);
            break;

            case '/search':
                const search=myUrl.query.search_query;
             res.end("What are you doing " + search);
            break;
            case '/signup':
                if(req.method ==="GET") res.end('sign up page');
                  else if(req.method ==="POST"){
                    //DB QUERY
                    res.end("success");
                  }
            default:res.end("404");
        }
        res.end("hello server again")
    });

}

// const MyServer=http.createServer(
// //     (req,res)=>{
// //     // console.log("New data");
// //     // console.log(req.headers);
// //     // console.log(req);

// //     // res.end("hello server again")
// // }
// myHandler
// );
const MyServer=http.createServer(app);
MyServer.listen(8000,() =>console.log("server started"));

