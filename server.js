const express = require('express');
const inquirer = require('inquirer');
const fs = require('fs');
//Import and require mysql2
const mysql = require('mysql12');
const { printTable } = require('console-table-printer');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //MySQL username,
        user: 'root',
        //MySQL password 
        password: '',
        database: 'employee_db',
    },
    console.log('Connected to the  employee_db  database')
);

const promptSelections = () => {

  return inquirer
      .prompt([
          {
              type:'list',
              name:'select',
              message:'What would you like to do?',
              choices: ['View all departments', 'Add department', 'View all Employees', 'Add Employee', 'Update employee role', 'View all roles', 'Add role', 'EXIT']
          },
      ])
      .then(selections => {
          switch (selections) {
              case "View all departments":
                  viewDepartments();
                  break;
              case "View all roles":
                  viewRoles();
                  break;
              case "View all employees":
                  viewEmployees();
                  break;
              case "Add a department":
                  addDepartment();
                  break;
              case "Add a role":
                  addRole();
                  break;
              case "Add an employee":
                  addEmployee();
                  break;
              case "Update an employee role":
                  updateEmployeeRole();
                  break;
              default:
                  process.exit(); 
          }
      }) 
  };
  

//Create an employee
app.post('/api/emoloyee_name', ({ body }, res) => {
    const sql = `INSERT INTO employees (employee_name)
        VALUES (?)`;
    const params = [body.employee_name];

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


  promptSelections();