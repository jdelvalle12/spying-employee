const inquirer = require('inquirer');
const fs = require('fs');

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