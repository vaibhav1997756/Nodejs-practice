const http=require("http");
const fs=require("fs");
const url =require("url");
const express = require('express');
const users=require("./MOCK_DATA.json");
const { config } = require("nodemon");

const mysql=require("mysql");
const connection=mysql.createConnection({
  host:'localhost',
  port:3307,
  database:'school_management',
  user:'root',

  password:''
});
 

connection.connect(function (err){
  if(err){
    console.log('error')
  }
  else{
    console.log("successfully created")
  }
});

const PORT =8000;

const app=express();
// middleware--> plugin
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
  //console.log("Hello");
  //req.creditCardNumber='124455'
  fs.appendFile('log.txt',`${Date.now()}:${req.method}:${req.path}\n`,(err,data)=>{
    next(); 
  });

 // return res.json({mgs:"Hello from Middleware 1"})

});


app.use((req,res,next)=>{
 
  console.log("Hello",req.myUserName);
 // return res.json({mgs:"Hello from Middleware 1"})
 req.myUserName="vaibhav";
 next();
})

app.use((req,res,next)=>{
  console.log("Hello");
  req.creditCardNumber='124455'
  next(); 
 // return res.json({mgs:"Hello from Middleware 1"})

});

app.get("/",(req,res)=>{
  return res.send("Hello from Home Page");
});

app.get("/api/users",(req,res)=>{
  res.setHeader("X-myName","Vaibhav Singh")
  return res.json(users);
});

app.post("/api/users",(req,res)=>{
  //TODO: Create ner user
  const body=req.body;
  if(!body || !body.first_name || !body.last_name || !body.email ||!body.gender){
    return res.status(400).json({msg:"All fields are req .."})
  }
  users.push({...body,id:users.length+1});
  fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    return res.status(201).json({status :"success",id:users.length + 1});
  });
  // console.log("Body",body);

});

app.patch("/api/users/:id",(req,res)=>{
  //TODO: Edit the user
  return res.json({status :"pending"});
});

app.delete("/api/users/:id",(req,res)=>{
  //TODO: Delete the user with id
  return res.json({status :"pending"});
});


app.get("/api/users/:id",(req,res)=>{
  const id=Number(req.params.id);
  const user=users.find((user)=>user[0].id === id);
  if(!user)  return res.status(404).json({error:"user not found"});

  return res.json(user);
});

app.get("/users",(req,res)=>{

const html=`<ul>${users.map(users =>`<li>${users.first_name}</li>`).join("")}</ul>`
      return res.send(html);
});


app.get("/about",(req,res)=>{
    // return res.send("Hello from About Page");
    return res.send(`Hello, ${req.query.name}`);
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
MyServer.listen(PORT,() =>console.log("server started"));

