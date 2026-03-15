const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db.js");

dotenv.config(); //load enviornment variables

const app=express();

connectDB();

app.use(cors());
app.use(express.json());

//test route
app.get("/",(req,res)=>{
    res.send("Server is running");
});

const PORT=process.env.PORT || 5000;
//starts the server
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT} `);
});