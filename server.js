const express = require('express');
//Import and require mysql2
const mysql = require('mysql12');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //MySQL username,
        user: '',
        //MySQL password 
        password: '',
        database: 'employee_db',
    },
    console.log('Connected to the  employee_db  database')
);

//Create an employee
app.post('/api/new-movie', ({ body }, res) => {
    const sqo = `INSERT INTO employees (employee_name)
        VALUES (?)`;
    const params = [bosy.employee_name];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//Read all employees
app.get('/api/employees', (req, res) => {
    const sql = `SELECT id, employee_name AS title FROM employees`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


//Update employee name
app.put('/api/employee/:id', (req, res) => {
    const sql = `UPDATE employee SET employee = ? WHERE id = ?`;
    const params = [req.body.review, req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Employee not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });
  
  // Default response for any other request (Not Found)
  app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });