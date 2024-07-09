const express = require('express');
const router = express.Router();
 const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticateToken = require ('../utils/authentication')

// Admin Registration
router.post('/register', (req, res) => {
    const { a_name, mobile_no, email_id, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const query = 'INSERT INTO Admin (a_name, mobile_no, email_id, password) VALUES (?, ?, ?, ?)';
    db.pool.execute(query, [a_name, mobile_no, email_id, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).send('Error registering admin');
        } else {
            res.status(200).send('Admin registered');
        }
    });
});

// Admin Login
router.post('/login', (req, res) => {
    const { email_id, password } = req.body;

    const query = 'SELECT * FROM Admin WHERE email_id = ?';
    db.pool.execute(query, [email_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Admin not found');
        }

        const admin = results[0];
        const validPass = bcrypt.compareSync(password, admin.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({ id: admin.a_id }, 'secret');
        res.header('auth-token', token).send(token);
    });

});

//  Hospital Status
router.put('/toggle-hospital-status',(req, res) => {
    const { status } = req.body;

    const query = 'UPDATE HospitalSettings SET is_open = ? WHERE id = 1';
    db.pool.execute(query, [status], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating hospital status');
        } else {
            res.status(200).send('Hospital status updated');
        }
    });
});

// View Appointments
router.get('/appointments', authenticateToken,(req, res) => {
    const query = 'SELECT * FROM Appointments';
    db.pool.execute(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching appointments');
        } else {
            res.status(200).json(results);
        }
    });
});

// Accept Appointment
router.post('/accept-appointment',(req, res) => {
    const { appointment_id } = req.body;

    const query = 'UPDATE Appointments SET accepted = 1 WHERE appointment_id = ?';
    db.pool.execute(query, [appointment_id], (err, result) => {
        if (err) {
            res.status(500).send('Error accepting appointment');
        } else {
            res.status(200).send('Appointment accepted');
        }
    });
});

//module.exports = router;
module.exports= router;
