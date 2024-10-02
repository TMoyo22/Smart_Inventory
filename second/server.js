const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const moment = require('moment'); 
require('dotenv').config();
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_stock_db'
});

app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer setup with hardcoded values
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,             
    secure: false,         
    auth: {
        user: 'manqobankosi007@gmail.com', 
        pass: 'mseymawpzghxkfst'           
    }
});

// Function to check for expiring products and send notifications
const checkForExpiringProducts = () => {
    const today = moment().format('YYYY-MM-DD');
    const threshold = moment().add(3, 'days').format('YYYY-MM-DD');

    db.query('SELECT * FROM products WHERE expiration_date BETWEEN ? AND ?', [today, threshold], (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return;
        }

        if (results.length > 0) {
            const notifications = results.map(product => `Product: ${product.product_name} expires on ${product.expiration_date}`).join('\n');

            // Send email notification
            const mailOptions = {
                from: 'manqobankosi007@gmail.com', 
                to: 'royaltym007@gmail.com', 
                subject: 'Product Expiration Alerts',
                text: notifications // Email body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.error('Error sending email:', error);
                }
                console.log('Email sent:', info.response);
            });
        }
    });
};

// check for expiring products every hour (3600000 ms)+ 

setInterval(checkForExpiringProducts, 8640000); //86400000

app.get("/api/products", (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Manual trigger endpoint for sending test email
app.get('/test-email', (req, res) => {
    // test product with an expiration date in 7 days
    const testProduct = {
        product_name: "Test Product",
        expiration_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    };

    // Prepare email options
    const mailOptions = {
        from: 'manqobankosi007@gmail.com',
        to: 'royaltym007@gmail.com', 
        subject: 'Test Email Notification',
        text: `This is a test notification for the product: ${testProduct.product_name} that expires on ${moment(testProduct.expiration_date).format('YYYY-MM-DD')}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending test email:', error);
            return res.status(500).send('Error sending test email');
        }
        console.log('Test email sent:', info.response);
        res.send('Test email sent successfully!');
    });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Hash passwords
const hashPasswords = async () => {
    db.query('SELECT Id, password FROM login', async (err, results) => {
        if (err) throw err;

        for (let login of results) {
            const userId = login.Id;
            const plainPassword = login.password;

            // Hashing
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Update database 
            db.query('UPDATE login SET password = ? WHERE Id = ?', [hashedPassword, userId], (err) => {
                if (err) throw err;
                console.log(`Updated user ${userId} with hashed password.`);
            });
        }
    });
};

hashPasswords();


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    //checkForExpiringProducts();
});
