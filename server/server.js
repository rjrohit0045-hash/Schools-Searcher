const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// --- STEP 1: APNE MYSQL DETAILS YAHA DAALEIN ---
// Highlighted section: Apne MySQL server ke username, password, aur database ka naam yaha daalein.
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <-- Yaha apna MySQL username daalein (e.g., 'root')
    password: 'kawasakih2r', // <-- Yaha apna MySQL password daalein
    database: 'school_db' // <-- Is database ko aapko MySQL mein banana hoga
});
// ----------------------------------------------------

// Database se connect karein
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Successfully connected to MySQL database.');
});

// Route to get all schools (Saare schools fetch karne ke liye)
app.get('/api/schools', (req, res) => {
    const sql = 'SELECT * FROM schools';
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Failed to fetch data from database" });
        }
        return res.json(data);
    });
});

// Route to add a new school (Naya school add karne ke liye)
app.post('/api/schools', (req, res) => {
    const { name, address, city, state, contact, image, email_id } = req.body;
    
    // Basic validation
    if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, address, city, state, contact, image, email_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to insert data into database" });
        }
        console.log("1 record inserted, ID: " + result.insertId);
        return res.status(201).json({ success: true, id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});

