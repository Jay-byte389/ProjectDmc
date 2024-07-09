const express = require('express');
const router = express.Router();

// Database connection
const db = require('../db');

// Add Prescription
router.post('/add', (req, res) => {
    const { medication, dosage, appointment_id, d_id } = req.body;
    console.log(req.body);

    const query = 'INSERT INTO Prescriptions (medication, dosage, appointment_id, d_id) VALUES (?, ?, ?, ?)';
    db.pool.execute(query, [medication, dosage, appointment_id, d_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error adding prescription');
        } else {
            res.status(200).send('Prescription added');
        }
    });
});

// View Prescriptions
router.get('/view/:appointment_id', (req, res) => {
    const { appointment_id } = req.params;

    const query = 'SELECT * FROM Prescriptions WHERE appointment_id = ?';
    db.pool.execute(query, [appointment_id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching prescriptions');
        } else {
            res.status(200).json(results);
        }
    });
});

//module.exports = router;
module.exports = router;