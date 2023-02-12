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

const promptOptions = () => {

  return inquirer
      .prompt([
          {
              type:'list',
              name:'select',
              message:'What would you like to do?',
              choices: ['View all departments', 'Add department', 'View all Employees', 'Add Employee', 'Update employee role', 'View all roles', 'Add role', 'EXIT']
          },
      ])
      .then(options => {
          switch (options) {
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
promptOptions();

//Read all departments
app.get('/api/department', (req, res) => {
  const sql = `SELECT id, department AS title FROM department_name`;

  db.query(sql, (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
      printTable(results);
  });
});

//Read all roles
app.get('/api/role', (req, res) => {
  const sql = `SELECT id, role AS title FROM role`;

  db.query(sql, (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
      printTable(results);
  });
});

//Read all employees
app.get('/api/employee', (req, res) => {
  const sql = `SELECT id, employee_name AS title FROM employee`;

  db.query(sql, (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
      printTable(results);
  });
});

//Add a department
const addDepartment = () => {

  return inquirer
      .prompt([
          {
              type:'input',
              name:'department',
              message:'What department would you like to add?',
          },
      ])
      .then (app.post('/api/add-department_name', ({ body }, res) => {
        const sql = `INSERT INTO department (department_name)
            VALUES (?)`;
        const params = [body.department_name];
      
        db.query(sql, params, (err, result) => {
            if(err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({
                message: 'success',
                data: body
            });
            printTable(result);
        });
      })
    )  
};
//Add a role
const addRole = () => {

  return inquirer
    .prompt([
          {
            type:'input',
            name:'role',
            message:'What role would you like to add?'
          },
          {
            type:'input',
            name:'department',
            message: 'Enter the department?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary?'
          }
  ])
  .then (app.post('/api/add-role_name', ({ body }, res) => {
  const sql = `INSERT INTO role (role_name)
      VALUES (?)`;
  const params = [body.role_name];

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
  }));
};
//Add an employee
const addEmployee = () => {

  return inquirer
      .prompt([
          {
            type:'input',
            name:'employee',
            message:'What department would you like to add?',
          },
      ])
.then (app.post('/api/add-employee_name', ({ body }, res) => {
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
}));
};
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

  //Delete employee
  app.delete('/api/employee:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
        message: 'Employee not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
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


 