const bcrypt = require("bcrypt");
const client = require("pg");
const jwt = require("jsonwebtoken");

//Verifying if the user exists in the database
const user = data.rows;
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
    const data = await client.query(`SELECT * FROM Login WHERE username= $1;`, [username]) 
    if (user.length === 0) {
    res.status(400).json({
    error: "Unauthosrized User",
    });
    }
    //Comparing the hashed password
    else{
bcrypt.compare(password, user[0].password, (err, result) => { 
if (err) {
res.status(500).json({
error: "Server error",
});
} else if (result === true) { //Checking if credentials match
const token = jwt.sign(
{
username: username,
},
process.env.SECRET_KEY
);
res.status(200).json({
message: "User signed in!",
token: token,
});
}
else {
//Declaring the errors
if (result != true)
res.status(400).json({
error: "Enter correct password!",
});
}
})
}
} catch (err) {
console.log(err);
res.status(500).json({
error: "Database error occurred while signing in!", //Database connection error
});
};
};