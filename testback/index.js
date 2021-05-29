const express = require("express");

const app= express();
const port= process.env.port || 5000;

app.get("/",(req,res) => {
    return res.send('HEllo COders');
});

app.get("/login",(req,res) => {
    return res.send('you are logged in this ');
});

app.get("/signup",(req,res) => {
    return res.send('you are signned up in this ');
});
//another way of creating routes
const admin = (req,res)=>{
    return res.send("This is admin dashboard")
};
//middleware
const isadmin = (req,res,next)=>{
    console.log("This is Middleware")
    next();
};

const isloggedin = (req,res,next)=>{
    console.log("admin is logged in")
    next();
}
app.get("/admin",isloggedin,isadmin, admin)


app.get("/signout",(req,res) => {
    return res.send('you are signned out ');
});



app.get("/login",(req,res) => {
    return res.send('you are logged in this ');
});

app.listen(port,() => {
    console.log("server is up and boom");
});

// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })