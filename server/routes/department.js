const express = require('express');
const router = express.Router();
const db = require('../db');

// Add Department
router.post('/add', (req, res) => {
    const { dept_name } = req.body;

    const query = 'INSERT INTO Departments (dept_name) VALUES (?)';
    db.pool.execute(query, [dept_name], (err, result) => {
        if (err) {
            res.status(500).send('Error adding department');
        } else {
            res.status(200).send('Department added');
        }
    });
});

// Delete Department
router.delete('/delete', (req, res) => {
    const { dept_id } = req.body;

    const query = 'DELETE FROM Departments WHERE dept_id = ?';
    db.pool.execute(query, [dept_id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting department');
        } else {
            res.status(200).send('Department deleted');
        }
    });
});

module.exports = router;
