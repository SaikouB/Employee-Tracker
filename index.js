// Required packages from npm
const inquirer = require('inquirer');
const mysql = require('mysql2');
const Table = require('cli-table3');
// Connects to MySQL database 
const employeeDb = mysql.createConnection({
    host: '127.0.0.1',
    // MySQL username
    user: 'root',
    // MySQL password
    password: 'Ro0t',
    // Inserts employees database from schema.sql
    database: 'employees_db'
}); // Console logs after connection is successful
console.log('""""""""""""""""""""""""""""""""""""""')
console.log('""""""""""""""""""""""""""""""""""""""')
console.log('                                      ')
console.log(' - WELCOME TO THE EMPLOYEE DATABASE - ')
console.log('                                      ')
console.log('""""""""""""""""""""""""""""""""""""""')
console.log('""""""""""""""""""""""""""""""""""""""')
// primary function that presents user with main menu
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
        'Remove a department',
        'Exit'],
}]
// Main menu function to prompt inquirer, run primary function and handle case and switch depending on user choice
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
            case 'Remove a department':
                removeDept();
                break;
            case 'Exit':
                console.log('Goodbye 🙂')
                employeeDb.end();
                break;
            default: break;
        }
    });
}
// Error handler if failed connection
employeeDb.connect((error) => {
    if (error) throw error;

    mainMenu();
});

// View all departments function
function department() {
    // Query variable to select department table and add the specified values
    let query = `SELECT 
    department.id AS Identification, 
    department.department_name AS Department 
    FROM department`;
    employeeDb.query(query, (error, results) => {
        if (error) throw error;
        // Creates table using cli-table3 npm package
        let table = new Table({
            head: ['Id', 'Department'],
            colWidths: [5, 12]

        });
        results.forEach((department) => {
            table.push([department.Identification, department.Department]);
        });
        console.log(table.toString());
        // Calls back main menu
        mainMenu();
    })
};
// View all roles function
function role() {
    // Query variable to select role table and add the specified values
    let query = `SELECT 
    role.id AS Identification,
    role.title AS Title,
    role.salary AS Salary,
    role.department_id AS Department
    FROM role`;
    employeeDb.query(query, (error, results) => {
        if (error) throw error;
        // Creates table for roles
        let table = new Table({
            head: ['Id', 'Title', 'Salary', 'Dept.'],
            colWidths: [5, 25, 8, 7]
        });
        results.forEach((role) => {
            table.push([role.Identification, role.Title, role.Salary, role.Department]);
        });
        console.log(table.toString());
        // calls back main menu
        mainMenu();
    });
};
// View all employees function
function employees() {
    // Query variable to select employees and create table using the specified values
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
        // Creates table for employees
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
        // calls back main menu 
        mainMenu();
    });
}
// Add department function
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

                console.log(`Successfully added ${newDepartment} to database!`);
                mainMenu();
            });
        });
};
// Async function to add role
async function addRole() {
    // Query variable to select department table
    let query = `SELECT 
    department.id AS Identification,
    department.department_name AS Department 
    FROM department`;
    let results = await employeeDb.promise().query(query)
    let departmentChoices = results[0]
    // For loop that loops through department choices and presents them to user by specified values
    for (let i = 0; i < departmentChoices.length; i++) {
        departmentChoices[i] = {
            name: departmentChoices[i].Department,
            value: departmentChoices[i].Identification
        }
    }
    // Prompt questions
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
    ])
        .then((inputs) => {
            const newRole = inputs.roleName;
            const newSalary = parseFloat(inputs.roleSalary);
            const newDepartment = inputs.roleDepartment;
            // Variable to insert new role in database
            let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            employeeDb.query(query, [newRole, newSalary, newDepartment], (error) => {
                if (error) throw error;

                console.log(`${newRole} Successfully added!`);
                mainMenu();
            })
        });
};
// Async function to add employee
async function addEmployee() {

    // Query that selects role table 
    let query1 = `SELECT 
    role.id AS Identification,
    role.title AS Title,
    role.salary AS Salary,
    role.department_id AS Department
    FROM role`;
    let results = await employeeDb.promise().query(query1)
    let roleChoices = results[0]
    // For loop that loops through role choices length
    for (let i = 0; i < roleChoices.length; i++) {
        roleChoices[i] = {
            name: roleChoices[i].Title,
            value: roleChoices[i].Identification
        }
    }
    // Query variable that selects managers
    let query2 = `SELECT 
    employee.id AS Identification,
    CONCAT (employee.first_name, ' ', employee.last_name) AS fullName
    FROM employee`;
    let managers = await employeeDb.promise().query(query2)
    let managerChoices = managers[0]
    // For loop that loops through manager's choices and presents them to user as a list
    for (let i = 0; i < managerChoices.length; i++) {
        managerChoices[i] = {
            name: managerChoices[i].fullName,
            value: managerChoices[i].Identification
        }
    }
    // Prompts user with necessary questions to add an employee
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
    ])
        .then((inputs) => {
            const theFirstName = inputs.firstName
            const theLastName = inputs.lastName
            const theEmployeeRole = inputs.employeeRole
            const theEmployeeManager = inputs.employeeManager
            // Inserts new employee in table with the specified values
            let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            employeeDb.query(query, [theFirstName, theLastName, theEmployeeRole, theEmployeeManager], (error) => {
                if (error) throw error;

                console.log(`Successfully added ${theFirstName} ${theLastName} to database`);
                mainMenu();
            })
        })

};
// Async function to update an employee's role
async function updateRole() {
    // Query to select employee to update role
    let query0 = `SELECT
    employee.id AS Identification,
    CONCAT (employee.first_name, ' ', last_name) AS fullName
    FROM employee`;
    let employees = await employeeDb.promise().query(query0)
    let employeeChoices = employees[0]
    // For loop that loops through employee choices and presents them to user
    for (let i = 0; i < employeeChoices.length; i++) {
        employeeChoices[i] = {
            name: employeeChoices[i].fullName,
            value: employeeChoices[i].Identification
        }
    }
    // Selects role table and presents user with role choices
    let query1 = `SELECT 
    role.id AS Identification,
    role.title AS Title
    FROM role`;
    let results = await employeeDb.promise().query(query1)
    let roleChoices = results[0]
    // Loops through role choices and presents them to user
    for (let i = 0; i < roleChoices.length; i++) {
        roleChoices[i] = {
            name: roleChoices[i].Title,
            value: roleChoices[i].Identification
        }
    }
    // Prompt questions to select employee and role
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
    ])
        .then((inputs) => {
            const theSelectedEmployee = inputs.selectedEmployee
            const theSelectedRole = inputs.selectedRole

            let query = `UPDATE employee SET role_id = ? WHERE id = ?`;
            employeeDb.query(query, [theSelectedRole, theSelectedEmployee], (error) => {
                if (error) throw error;

                console.log(`Successfully updated employee's role`);
                mainMenu();
            })
        })
};
// Async funtion to remove department
async function removeDept() {
    // Selects department table
    let query = `SELECT 
    department.id AS Id,
    department.department_name AS Department
    FROM department`;
    let results = await employeeDb.promise().query(query)
    let deptChoices = results[0]
    // Loops through dept choices and presents them to user
    for (i = 0; i < deptChoices.length; i++) {
        deptChoices[i] = {
            name: deptChoices[i].Department,
            value: deptChoices[i].Id
        };
    }
    // Prompt question that lets user chooce department to remove
    inquirer.prompt([{
        type: 'list',
        name: 'removeDept',
        message: 'Choose the Department you would like to remove:',
        choices: deptChoices
    }])
        .then((choice) => {
            let departmentId = choice.removeDept
            let departmentName = deptChoices.find(department => department.value === departmentId).name;
            // query that removes department from table
            let queryRemoveDept = `DELETE FROM department WHERE id = ?`;
            employeeDb.promise().query(queryRemoveDept, [departmentId]);

            console.log(`Successfully removed ${departmentName} from database`);
            mainMenu();
        })
}
