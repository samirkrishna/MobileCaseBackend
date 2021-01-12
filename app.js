const express = require("express")
const app =express()

app.get("/",(req,res)=>{
    res.send("hello samir krishna")
})

const PORT = 5000;

app.listen(PORT,()=>{
    console.log("Server is Up and Running")
})