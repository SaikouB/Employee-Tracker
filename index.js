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
}, console.log('Welcome to the Employee database')
);
employeeDb.connect((error) => {
    if (error) throw error;

    primaryPrompt();
});

const primaryPrompt = () => [{
    type: 'list',
    name: 'begin',
    message: 'Please choose from the following:',
    choices: ['View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'],
}]
inquirer.prompt(primaryPrompt()).then((choice) => {
    switch (choice.begin) {
        case 'View all departments':
            departments();
            break;
        case 'View all roles':
            roles();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee role':
            updateRole();
            break;
        case 'Exit':
            exit();
            break;
        default: break;
    }
})