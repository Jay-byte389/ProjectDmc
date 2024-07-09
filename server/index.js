const express = require('express');

const config = require('./config')
const cors = require('cors')
const bodyParser = require('body-parser');


const app = express();
app.use(cors())
app.use(express.json());



 const authenticateToken = require ('./utils/authentication')
// Routes
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');
const departmentRoutes = require('./routes/department');
const prescriptionRoutes = require('./routes/prescription');
const billRoutes = require('./routes/bill');

// Use routes
app.use('/admin', adminRoutes);
app.use('/doctor',  doctorRoutes);
app.use('/patient',  patientRoutes);
app.use('/department',  departmentRoutes);
app.use('/prescription',  prescriptionRoutes);
app.use('/bill',  billRoutes);

app.listen(4000,'0.0.0.0', () => {
    console.log(`Server  started on port 4000`);
});
