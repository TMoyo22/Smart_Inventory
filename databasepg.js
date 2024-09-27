const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Chelseafc",
    database: "Smart Inventory Management"
})


client.connect();

client.query('Select * from "Login"', (err, res)=>{
    if(!err){
        console.log(res.rows);     
    }else{
        console.log(err.message)
    }
    client.end;
})