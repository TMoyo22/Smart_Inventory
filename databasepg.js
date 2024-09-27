const {Pool} = require('pg');
require('dotenv').config();


const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
})


pool.connect();

pool.query('Select * from "Login"', (err, res)=>{
    if(!err){
        console.log(res.rows);     
    }else{
        console.log(err.message)
    }
    pool.end;
})