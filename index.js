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
                employees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
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
    let query = `SELECT 
    role.id AS Identification,
    role.title AS Title,
    role.salary AS Salary,
    role.department_id AS Department
    FROM role`;
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

function employees() {
    let query = `SELECT 
    employee.id AS Identification, 
    employee.first_name AS FirstName, 
    employee.last_name AS LastName, 
    role.title AS Title,
    department.department_name AS Department,
    role.salary AS Salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    LEFT JOIN role AS role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

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
                mainMenu();
            });
        });
};

async function addRole() {

    // fetch department choices here
    let query = `SELECT 
    department.id AS Identification,
    department.department_name AS Department 
    FROM department`;
    let results = await employeeDb.promise().query(query)
    let departmentChoices = results[0]

    for (let i = 0; i < departmentChoices.length; i++) {
        departmentChoices[i] = {
            name: departmentChoices[i].Department,
            value: departmentChoices[i].Identification
        }
    }

    console.log(departmentChoices)

    inquirer.prompt([{
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the Role you want to add?'
    }, {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?'
    }, {
        type: 'list',
        name: 'roleDepartment',
        message: 'Which department does the role belong to?',
        choices: departmentChoices
    }
    ]).then((inputs) => {
        const newRole = inputs.roleName;
        const newSalary = parseFloat(inputs.roleSalary);
        const newDepartment = inputs.roleDepartment;


        let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        employeeDb.query(query, [newRole, newSalary, newDepartment], (error) => {
            if (error) throw error;

            console.log(`${newRole} Successfully added!`);
            mainMenu();
        })
    });
}; 

async function addEmployee() {

    // fetch roles and managers here
    let query1 = `SELECT 
    role.id AS Identification,
    role.title AS Title,
    role.salary AS Salary,
    role.department_id AS Department
    FROM role`;
    let results = await employeeDb.promise().query(query1)
    let roleChoices = results[0]

    for (let i = 0; i < roleChoices.length; i++) {
        roleChoices[i] = {
            name: roleChoices[i].Title, 
            value: roleChoices[i].Identification
        }
    }
    let query2 =  `SELECT 
    employee.id AS Identification,
    CONCAT (employee.first_name, ' ', employee.last_name) AS fullName
    FROM employee`;
    let managers = await employeeDb.promise().query(query2)
    let managerChoices = managers[0]

    for(let i = 0; i < managerChoices.length; i++) {
        managerChoices[i] = {
            name: managerChoices[i].fullName,
            value: managerChoices[i].Identification
        }
    }
    
    inquirer.prompt([{
        type: 'input',
        name: 'firstName',
        message: `What is the employee's first name?`
    }, {
        type: 'input',
        name: 'lastName',
        message: `What is the employee's last name?`
    }, {
        type: 'list',
        name: 'employeeRole',
        message: `What is the employee's role?`,
        choices: roleChoices
    }, {
        type: 'list',
        name: 'employeeManager',
        message: `Who is the employee's manager?`,
        choices: managerChoices
    }
    ]).then((inputs) => {
        const theFirstName = inputs.firstName
        const theLastName = inputs.lastName
        const theEmployeeRole = inputs.employeeRole
        const theEmployeeManager = inputs.employeeManager

        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        employeeDb.query(query, [theFirstName, theLastName, theEmployeeRole, theEmployeeManager], (error) => {
            if (error) throw error;

            console.log(`Successfully added ${theFirstName} ${theLastName} to database`);
            mainMenu();
        })
    })

};

async function updateRole() {
    let query0 = `SELECT
    employee.id AS Identification,
    CONCAT (employee.first_name, ' ', last_name) AS fullName
    FROM employee`;
    let employees = await employeeDb.promise().query(query0)
    let employeeChoices = employees[0]
    for (let i = 0; i < employeeChoices.length; i++) {
        employeeChoices[i] = {
            name: employeeChoices[i].fullName,
            value: employeeChoices[i].Identification
        }
    }

    let query1 = `SELECT 
    role.id AS Identification,
    role.title AS Title
    FROM role`;
    let results = await employeeDb.promise().query(query1)
    let roleChoices = results[0]

    for (let i = 0; i < roleChoices.length; i++) {
        roleChoices[i] = {
            name: roleChoices[i].Title, 
            value: roleChoices[i].Identification
        }
    }

    inquirer.prompt([{
        type: 'list',
        name: 'selectedEmployee',
        message: `Which employee's role do you want to update?`,
        choices: employeeChoices
    }, {
        type: 'list',
        name: 'selectedRole',
        message: 'What role do you want to assign the selected employee?',
        choices: roleChoices
    }
    ]).then((inputs) => {
        const theSelectedEmployee = inputs.selectedEmployee
        const theSelectedRole = inputs.selectedRole

        let query = `UPDATE employee SET (first_name, last_name) = ? WHERE role_id = ?`;
        employeeDb.query(query, [theSelectedRole, theSelectedEmployee], (error) => {
            if (error) throw error;

            console.log(`Successfully updated role for ${theSelectedEmployee} to ${theSelectedRole}`);
            mainMenu();
        })
    })
};