const inquirer = require('inquirer');
const mysql = require('mysql2')

const employeeDb = mysql.createConnection({
    host: '127.0.0.1',
    // MySQL username
    user: 'root',
    // MySQL password
    password: '',
    // Inserts employees database from schema.sql
    database: 'employees_db'
});

const questions = [{
    type: 'list',
    name: 'options',
    message: 'Please choose from the following options:',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
}, {
    
}

]

inquirer.prompt(questions).then()