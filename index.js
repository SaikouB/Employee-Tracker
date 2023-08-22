const inquirer = require('inquirer');
const mysql = require('mysql2')
const Table = require('cli-table3');

const employeeDb = mysql.createConnection({
    host: '127.0.0.1',
    // MySQL username
    user: 'root',
    // MySQL password
    password: 'Ro0t',
    // Inserts employees database from schema.sql
    database: 'employees_db'
});
console.log('""""""""""""""""""""""""""""""""""""""')
console.log('""""""""""""""""""""""""""""""""""""""')
console.log('                                      ')
console.log(' - WELCOME TO THE EMPLOYEE DATABASE - ')
console.log('                                      ')
console.log('""""""""""""""""""""""""""""""""""""""')
console.log('""""""""""""""""""""""""""""""""""""""')

const primaryPrompt = () => [{
    type: 'list',
    name: 'begin',
    message: 'What would you like to do?',
    choices: ['View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'],
}]
// Main menu function to prompt inquirer and handle case and switch depending on user choice
function mainMenu() {
    inquirer.prompt(primaryPrompt()).then((choice) => {
        switch (choice.begin) {
            case 'View all departments':
                department();
                break;
            case 'View all roles':
                role();
                break;
            case 'View all employees':
                employee();
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
                console.log('Goodbye 🙂')
                employeeDb.end();
                break;
            default: break;
        }
    });
}

employeeDb.connect((error) => {
    if (error) throw error;

    mainMenu();
});

// Functions

function department() {
    let query = 'SELECT department.id AS Identification, department.department_name AS Department FROM department';
    employeeDb.query(query, (error, results) => {
        if (error) throw error;

        let table = new Table({
            head: ['Id', 'Department'],
            colWidths: [5, 12]

        });
        results.forEach((department) => {
            table.push([department.Identification, department.Department]);
        });
        console.log(table.toString());

        mainMenu();
    })
};

function role() {
    let query = 'SELECT role.id AS Identification, role.title AS Title, role.salary AS Salary, role.department_id AS Department FROM role';
    employeeDb.query(query, (error, results) => {
        if (error) throw error;

        let table = new Table({
            head: ['Id', 'Title', 'Salary', 'Dept.'],
            colWidths: [5, 25, 8, 7]
        });
        results.forEach((role) => {
            table.push([role.Identification, role.Title, role.Salary, role.Department]);
        });
        console.log(table.toString());

        mainMenu();
    });
};

function employee() {
    let query = `SELECT 
    employee.id AS Identification, 
    employee.first_name AS FirstName, 
    employee.last_name AS LastName, 
    role.title AS Title,
    department.department_name AS Department,
    role.salary AS Salary,
    CONCAT(employee.first_name, employee.last_name) AS Manager,
    FROM employee As Manager
    LEFT JOIN role AS role ON employee.role_id = role.id
    LEFT JOIN department As department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;

    employeeDb.query(query, (error, results) => {
        if (error) throw error;

        let table = new Table({
            head: ['Id', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 12, 12, 20, 25, 10, 20]
        });
        results.forEach((employee) => {
            table.push([
                employee.Identification,
                employee.FirstName,
                employee.LastName,
                employee.Title,
                employee.Department,
                employee.Salary,
                employee.Manager
            ]);
        });
        console.log(table.toString());

        mainMenu();
    });
}

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'departmentName',
        message: 'Enter the new department name'
    }])
        .then((input) => {
            const newDepartment = input.departmentName;
            let query = `INSERT INTO department (department_name) VALUES  (?)`;
            employeeDb.query(query, [newDepartment], (error, results) => {
                if (error) throw error;

                console.log(`${newDepartment} Successfully added!`);
            });
        });
};

function addRole () {
    inquirer.prompt([{
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the Role you want to add?'
    }, {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?'
    }, {
        type: 'input',
        name: 'roleDepartment',
        message: 'What department does the role belong to?'
    }
]) .then((role, salary, department) => {
        const newRole = role.roleName;
        const newSalary = salary.roleSalary;
        const newDepartment  = department.roleDepartment;
        

        let query = `INSERT INTO role (id) VALUES (?)`;
        employeeDb.query(query, [newRole], [newSalary], [newDepartment], (error) => {
            if (error) throw error;

            console.log(`${newRole} Successfully added!`);
            mainMenu();
        })
    });
};



