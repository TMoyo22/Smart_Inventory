const express =  require('express');
const cors = require("cors");
const path = require("path");
const {Pool} = require("pg");
const user  =  require("./users");
require('dotenv').config();


 const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
})


const app = express(); //Initialized express
app.use("/users",  user);  
app.use(express.static(path.join(__server.js, 'public')));


app.use(express.json());
app.use(cors());
app.use("/users",  user);  

const port = 3000;

app.get("/", (req, res) => {
res.sendFile(path.join(__server.js, './index.html'));
})

pool.connect((err) => { //Connected Database
if (err) {
console.log(err);
}
else {
console.log("Connected to Database");}
});



app.listen(port, () => {
console.log(`Listening on ${port}.`);
})