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
    console.log('Connected to the employees database')
);

function optionsMenu () {
 inquirer .prompt([
          {
              type:'list',
              name:'options',
              message:'What would you like to do?',
              choices: ['View all departments', 'Add department', 'View all Employees', 'Add Employee', 'Update employee role', 'View all roles', 'Add role', 'EXIT']
          },
        ])
      .then(options => {
          switch (options) {
              case "View all departments":
                  viewDepartments();
                  return;
                  
              case "View all roles":
                  viewRoles();
                  return;
              case "View all Employees":
                  viewAllEmployees();
                  return;
              case "Add department":
                  addDepartment();
                  return;
              case "Add role":
                  addRole();
                  return;
              case "Add employee":
                  addEmployee();
                  return;
              case "Update employee role":
                  updateEmployeeRole();
                  return;
              default:
                  process.exit(); 
          }
    }); 
};



//Read all departments
function viewDepartments () {
  db.query( `SELECT * FROM department`, function (err,results) {
 
    if (err) throw err;
    // printTable(results);
    console.table(results);
    optionsMenu();
      });
      
};

//Read all roles
function viewRoles () {
  db.query( `SELECT * FROM role`, function (err, results) {

    if (err) throw err
      printTable(results);
      optionsMenu();
  });
  
};

//Read all employees
function viewAllEmployees () {
  db.query( `SELECT * FROM employee`, function (err, results) {
  
    if (err) throw err;
      printTable(results);
      optionsMenu();
  });
 
};

//Add a department
function addDepartment () {
 inquirer .prompt([
          {
              type:'input',
              name:'department_name',
              message:'What department would you like to add?',
          },
        ])
      .then (({ department_name }) => {
        const sql = `INSERT INTO department (department_name)
            VALUES (?)`;
        const params = [department_name];
        db.query(sql, params, (err, results) => {
          if (err) throw err;
            printTable(results);
            optionsMenu();
        });
        
      }
)};  

//Add a role
function addRole () {
 inquirer .prompt([
          {
            type:'input',
            name:'title',
            message:'What role would you like to add?'
          },
          {
            type:'input',
            name:'department_name',
            message: 'Enter the department?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary?'
          }
        ])
  .then (({ title, department_name, salary }) => {
  const sql = `INSERT INTO role (title, department_name, salary)
      VALUES (?)`;
  const params = [title, department_name, salary];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
      printTable(result);
      optionsMenu();
    });
   
  });
};
//Add an employee
function addEmployee () {
 inquirer .prompt([
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
            name:'role_id',
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
            name: 'manager_id',
            message: 'Is the employee a manager?'
          },
        ])
        .then(({ first_name, last_name, role_id, department_name, manager_id}) => {
          const sql = `INSERT INTO employee (first_name, last_name, role_id, department_name, manager_id)
            VALUES (?)`;
          const params = [first_name, last_name, role_id, department_name, manager_id];

          db.query(sql, params, (err, result) => {
           if (err) throw err;
            printTable(result);
            optionsMenu();
    });
     
  });
};
//Update employee
function updateEmployeeRole () {
 inquirer .prompt([
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
            name:'title',
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
        ])
        .then(({first_name, last_name, role_id, id, department_name, salary}) => {
          const sql = `UPDATE employee SET employee = ? WHERE id = ?`;
          const params = [first_name, last_name, role_id, id, department_name, salary];
  
          db.query(sql, params, (err, result) => {
            if (err) throw err;
            printTable(result);
            optionsMenu();
          });
          
        });
      };


  //Delete employee
  // app.delete('/api/employee:id', (req, res) => {
  //   const sql = `DELETE FROM employee WHERE id = ?`;
  //   const params = [req.params.id];
    
  //   db.query(sql, params, (err, results) => {
  //     if (err) {
  //       res.statusMessage(400).json({ error: res.message });
  //     } else if (!results.affectedRows) {
  //       res.json({
  //       message: 'Employee not found'
  //       });
  //     } else {
  //       res.json({
  //         message: 'deleted',
  //         changes: results.affectedRows,
  //         id: req.params.id
  //       });
  //     }
  //   });
  // });
  
  // Default response for any other request (Not Found)
  app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  optionsMenu();

  
  

  
