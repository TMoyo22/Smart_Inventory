const express = require('express');
const router = express.Router();
const {login} = require("./login");


router.post('/login' , login); // this is the POST request to login the user
module.exports = router;