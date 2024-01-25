const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Bootcamp',
    database: 'company_db',
});


// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
});

//  // Execute the SQL INSERT statement with the department name
//  const insertQuery = 'INSERT INTO department (name) VALUES (?)';
//  connection.query(insertQuery, [departmentName], (err, result) => {
//    if (err) throw err;
//    console.log('Department added successfully.');
//  });

// Function to start the application
function startApp() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
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
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

// Function to view all departments
function viewDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

// Function to view all roles
function viewRoles() {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

// Function to view all employees
function viewEmployees() {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

// Function to add a department
function addDepartment() {
    inquirer
        .prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:',
        })
        .then((answer) => {
            const query = `INSERT INTO department (name) VALUES ('${answer.name}');`
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log('Department added successfully!');
                startApp();
            });
        });
}

// Function to add a role
function addRole() {
    // Fetch department names from the database to display as choices
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the name of the role:',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary for the role:',
                },
                {
                    name: 'department',
                    type: 'list',
                    message: 'Select the department for the role:',
                    choices: res.map((department) => department.name),
                },
            ])
            .then((answers) => {
                // Find the department ID based on the selected department name
                const departmentId = res.find(
                    (department) => department.name === answers.department
                ).id;
                const query = 'INSERT INTO role SET ?';
                connection.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: departmentId,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log('Role added successfully!');
                        startApp();
                    }
                );
            });
    });
}

// Function to add an employee
function addEmployee() {
    // Fetch role titles from the database to display as choices
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter the first name of the employee:',
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter the last name of the employee:',
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Select the role for the employee:',
                    choices: res.map((role) => role.title),
                },
                {
                    name: 'manager',
                    type: 'input',
                    message: 'Enter the manager ID for the employee:',
                },
            ])
            .then((answers) => {
                // Find the role ID based on the selected role title
                const roleId = res.find((role) => role.title === answers.role).id;
                const query = 'INSERT INTO employee SET ?';
                connection.query(
                    query,
                    {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: roleId,
                        manager_id: answers.manager,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log('Employee added successfully!');
                        startApp();
                    }
                );
            });
    });
}


// Function to update an employee role
function updateEmployeeRole() {
    // Fetch employee names from the database to display as choices
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: res.map(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name} (ID: ${employee.id})`
                    ),
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Select the new role for the employee:',
                    choices: res.map((role) => role.title),
                },
            ])
            .then((answers) => {
                // Find the employee ID based on the selected employee name
                const employeeId = res.find(
                    (employee) =>
                        `${employee.first_name} ${employee.last_name} (ID: ${employee.id})` ===
                        answers.employee
                ).id;
                // Find the role ID based on the selected role title
                const roleId = res.find((role) => role.title === answers.role).id;
                const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                connection.query(query, [roleId, employeeId], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    startApp();
                });
            });
    });
}