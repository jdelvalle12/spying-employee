const express = require('express');
const inquirer = require('inquirer');
const fs = require('fs');
//Import and require mysql2
const mysql = require('mysql2');
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
        password: '#DiaKid12',
        database: 'employees_db',
    },
    console.log('Connected to the  employees_db  database')
);

 inquirer
      .prompt(
          {
              type:'list',
              name:'select',
              message:'What would you like to do?',
              choices: ['View all departments', 'Add department', 'View all Employees', 'Add Employee', 'Update employee role', 'View all roles', 'Add role', 'EXIT']
          },
      )
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
              case "Update an employee info":
                  updateEmployeeInfo();
                  break;
              default:
                  process.exit(); 
          }
    })
    .then(answers => {
      console.info(answers);
    }); 



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
 inquirer
      .prompt(
          {
              type:'input',
              name:'department',
              message:'What department would you like to add?',
          },
      )
      .then (app.post('/api/department_name', ({ body }, res) => {
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

//Add a role
 inquirer
    .prompt(
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
  )
  .then (app.post('/api/role_name', ({ body }, res) => {
  const sql = `INSERT INTO role (role_name)
      VALUES (?)`;
  const params = [body.role_name, body.department_name, body.salary];

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

//Add an employee
 inquirer
      .prompt(
          {
            type:'input',
            name:'first_name',
            message:'What is the employees first_name?'
          },
          {
            type:'input',
            name:'last_name',
            message: 'What is the employees last_name?'
          },
          {
            type:'input',
            name:'employee_role',
            message: 'What is the employee role?'
          },
          {
            type: 'input',
            name:'department_name',
            message: 'What department the employee works in?',
            choices: ['Sales', 'Finance', 'Engineering', 'Legal', 'Service']
          },
          {
            type:'input',
            name: 'manager',
            message: 'Is the employee a manager?'
          },
      )
.then (app.post('/api/employee_name', ({ body }, res) => {
  const sql = `INSERT INTO employee (employee_name)
      VALUES (?)`;
  const params = [body.first_name, body.last_name, body.role_name, body.department_name, body.manager];

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

//Update employee
 inquirer
      .prompt(
          {
            type:'input',
            name:'first_name',
            message:'What is the employees first_name?'
          },
          {
            type:'input',
            name:'last_name',
            message: 'What is the employees last_name?'
          },
          {
            type:'input',
            name:'employee_role',
            message: 'What is the employee role?'
          },
          {
            type: 'input',
            name:'department_name',
            message: 'What department the employee works in?',
            choices: ['Sales', 'Finance', 'Engineering', 'Legal', 'Service']
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary?' 
          },
          {
            type:'input',
            name: 'manager',
            message: 'Is the employee a manager?'
          },
      )
.then(app.put('/api/employee/:id', (req, res) => {
    const sql = `UPDATE employee SET employee = ? WHERE id = ?`;
    const params = [req.body.role_name, req.params.id, req.body.department_name, req.body.salary];
  
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
  }));


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

  // promptOptions();
  // printTable(results);
  // addDepartment();
  // addRole();
  // addEmployee();
  // updateEmployeeInfo();
  
 