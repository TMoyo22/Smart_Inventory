const  express  =  require("express");
const cors = require("cors");
const path = require("path");
const  client  =  require("pg");
const  user  =  require("./routes/user");

app.use("/user",  user);  

const app = express(); //Initialized express

app.use(express.json());
app.use(cors());
app.use("/user",  user);  

const port 