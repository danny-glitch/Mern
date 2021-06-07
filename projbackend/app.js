require('dotenv').config()

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My Routes
const authRoutes = require("./routes/auth"); 
const userRoutes = require("./routes/user");

//db connection
mongoose.connect(process.env.Database,
    {useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
})
    
    .then(() =>{
        console.log("DB connected!");
    });

//middlewares
app.use(bodyParser.json());    
app.use(cookieParser()); 
app.use(cors()); 

//My routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);

//port
const port= process.env.port || 3500;


//listening port
app.listen(port,()=>{
    console.log(`port is running at ${port}`);
});
