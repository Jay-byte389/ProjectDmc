const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');


function convertUndefinedToNull(data) {
    return data == undefined ? null : data;
  }






router.post ('/register',router.post('/register', (req, res) => {
    const { first_name, last_name, age, gender, address, mobile_no, email_id, password } = req.body;
    console.log(req.body);

    const hashedPassword = bcrypt.hashSync(password);
  
    const query = 'INSERT INTO Patients (first_name, last_name, age, gender, address, mobile_no, email_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
    db.pool.execute(query, [first_name, last_name, age, gender,address, mobile_no, email_id, hashedPassword], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error registering patient');
      } else {
        res.status(200).send('Patient registered');
      }
    });
  }));


// Patient Login
router.post('/login', (req, res) => {
    const { email_id, password } = req.body;

    const query = 'SELECT * FROM Patients WHERE email_id = ?';
    db.pool.execute(query, [email_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Patient not found');
        }

        const patient = results[0];
        const validPass = bcrypt.compareSync(password, patient.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({ id: patient.p_id }, 'secret');
        res.header('auth-token', token).send(token);
    });
});

// Book Appointment
router.post('/book-appointment', (req, res) => {
    const { date, time, disease, d_id,p_id } = req.body;
    console.log(req.body);

    const query = 'INSERT INTO Appointments (date, time, disease, d_id, p_id) VALUES (?, ?, ?, ?, ?)';
    console.log(query);

    db.pool.execute(query, [date, time, disease, d_id, p_id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error booking appointment');
        } else {
            res.status(200).send('Appointment booked');
        }
    });
});

// View Appointments
router.get('/appointments', (req, res) => {
    const {p_id}= req.body;

    const query = 'SELECT * FROM Appointments WHERE p_id = ?';
    db.pool.execute(query, [p_id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching appointments');
        } else {
            res.status(200).json(results);
        }
    });
});

module.exports = router;
