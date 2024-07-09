const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Database connection
const db = require('../db');


function convertUndefinedToNull(data) {
    return data === undefined ? null : data;
  }
  

// Doctor Registration
router.post('/register', (request, response) => {
    const { first_name, last_name, dept_name, experience, fee, dept_id, email_id, password } = request.body;
    console.log(request.body);
    const hashedPassword = bcrypt.hashSync(password);


    const query = `INSERT INTO Doctors (first_name, last_name, dept_name, experience, fee, dept_id, email_id, password)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.pool.execute(query, [first_name, last_name, convertUndefinedToNull(dept_name), convertUndefinedToNull(experience), convertUndefinedToNull(fee), dept_id, email_id, hashedPassword],
        (err, results) => {
          if (err) {
            console.error('Error executing query:', err);
            return response.status(500).send('Internal Server Error');
          }else {
          response.status(201).send('Doctor registered successfully');
        }
    });

});


// Doctor Login
router.post('/login', (req, res) => {
    const { email_id, password } = req.body;

    const query = 'SELECT * FROM Doctors WHERE email_id = ?';
    db.pool.execute(query, [email_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Doctor not found');
        }

        const doctor = results[0];
        const validPass = bcrypt.compareSync(password, doctor.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({ id: doctor.d_id }, 'secret');
        res.header('auth-token', token).send(token);
    });
});

// // Reserve Time Slot
// router.post('/reserve-slot', (req, res) => {
//     const { date, time } = req.body;
//     const doctor_id = req.user.id;

//     const query = 'INSERT INTO TimeSlots (doctor_id, date, time) VALUES (?, ?, ?)';
//     db.pool.execute(query, [doctor_id, date, time], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Error reserving time slot');
//         } else {
//             res.status(200).send('Time slot reserved');
//         }
//     });
// });



router.post('/reserve-slot', (req, res) => {
    const { date, time ,doctor_id} = req.body;
  
    if (!date || !time) {
      return res.status(400).send('Date and time are required');
    }
    //checking Availability
    const checkAvailabilityQuery = `
      SELECT * FROM TimeSlots 
      WHERE doctor_id = ? AND date = ? AND time = ?
    `;
  
    db.pool.execute(checkAvailabilityQuery, [doctor_id, date, time], (err, results) => {
      if (err) {
        console.error(err); 
        return res.status(500).send('Error checking time slot availability');
      }
  
      if (results.length > 0) {
        return res.status(400).send('Time slot is already reserved');
      }
  
      // Insert the new time slot
      const insertSlotQuery = `
        INSERT INTO TimeSlots (doctor_id, date, time) 
        VALUES (?, ?, ?)
      `;
  
      db.pool.execute(insertSlotQuery, [doctor_id, date, time], (err, result) => {
        if (err) {
          console.error(err); 
          return res.status(500).send('Error reserving time slot');
        }
        res.status(200).send('Time slot reserved successfully');
      });
    });
  });
  

// View Appointments
router.get('/appointment', (req, res) => {
    const {d_id} = req.body;

    const query = 'SELECT * FROM Appointments WHERE d_id = ?';
    db.pool.execute(query, [d_id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching appointments');
        } else {
            res.status(200).json(results);
        }
    });
});

// Delete Doctor
router.delete('/delete', (req, res) => {
    const doctor_id = req.user.id;

    const query = 'DELETE FROM Doctors WHERE d_id = ?';
    db.pool.execute(query, [doctor_id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting doctor');
        } else {
            res.status(200).send('Doctor deleted');
        }
    });
});

//module.exports = router;
module.exports=router;