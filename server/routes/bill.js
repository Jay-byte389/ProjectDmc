const express = require('express');
const router = express.Router();

// Database connection
const db = require('../db');

// Add Bill
router.post('/add', (req, res) => {
    const { date, amount, appointment_id, p_id } = req.body;

    const query = 'INSERT INTO Bills (date, amount, appointment_id, p_id) VALUES (?, ?, ?, ?)';
    db.pool.execute(query, [date, amount, appointment_id, p_id], (err, result) => {
        if (err) {
            res.status(500).send('Error adding bill');
        } else {
            res.status(200).send('Bill added');
        }
    });
});

// View Bills
router.get('/view/:appointment_id', (req, res) => {
    const { appointment_id } = req.params;

    const query = 'SELECT * FROM Bills WHERE appointment_id = ?';
    db.pool.execute(query, [appointment_id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching bills');
        } else {
            res.status(200).json(results);
        }
    });
});

// module.exports = router;
module.exports = router;