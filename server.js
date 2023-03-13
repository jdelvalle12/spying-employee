//Import requirements
const express = require('express');
const inquirer = require('inquirer');

//Import and require mysql2
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
// app.use(express.urlencoded({ extended: true }));
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

runApp();

//Initializing app
function runApp () {
 inquirer .prompt([
          {
              type:'list',
              name:'questions',
              message:'What would you like to do?',
              choices: ['View all departments', 'Add department', 'View all Employees', 'Add Employee', 'Update employee role', 'View all roles', 'Add role', 'EXIT']
          },
        ])
      .then(answer => {
        console.log(answer);
        userInput(answer);
      })
};

//Switch function
function userInput(answer) {
  const options = answer.questions;
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
                  console.log("Please select an option!");
                  runApp(); 
          } 
};



//Function to read all departments
function viewDepartments () {
  db.query( `SELECT * FROM department`, function (err,results) {
 
    if (err) throw err;
    printTable(results);
    promptExit();
    })
      
};

//Function to read all roles
function viewRoles () {
  db.query( `SELECT employee_role.id, employee_role.title, department.department_name 
  FROM employee_role LEFT JOIN department ON employee_role.department_id`,function (err, results) {

   if (err) throw err
    printTable(results);
    promptExit();
  });  
};

//Function to read all employees
function viewAllEmployees () {
  db.query( `SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, concat(mgr.first_name, ' ', mge.last_name) 
  AS manager FROM employee LEFT JOIN employee_role ON employee.role_id = employee_rold.id LEFT JOIN employee
  AS mgr ON employee.manager_id = mgr.id`, function (err, results) {
  
  if (err) throw err;
    printTable(results);
    promptExit();
  })
 
};

//Add a department
function addDepartment () {
 inquirer .prompt(
          {
              type:'input',
              name:'department_name',
              message:'What department would you like to add?',
          },
        )
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
  db.query("SELECT id value, department_name FROM department", function (err, res) {
    if (err) throw err;
  
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
      VALUES (?, ?, ?)`;
  const params = [title, department_name, salary];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
      viewRoles();
    });
   
  });
  });
};
//Add an employee
function addEmployee () {
  db.query("SELECT id value, title name FROM employee_role", function (err, res) {
    if (err) throw err;
    db.query(`SELECT concat(first_name, ' ', last_name) name, id value FROM employee`, 
    function (err, employeeRes)) {

    
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

  
  

  
