const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.options("*" ,cors())
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/", require("./router/index"));

app.use((req,res,next) =>{
    const error = new Error("masih kosong");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status = (error.status || 500);
    res.json({
        error : error.message
    })
})

app.listen(PORT, ()=>{
  console.log(`server running in http://localhost:${PORT}`)  
})