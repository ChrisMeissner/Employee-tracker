//download and require dependencies

const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// database connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employeeDB'
})

connection.connect(err => {
  if (err) throw err;
});

//view all departments
//presented with a formatted table showing department names and 
//department ids
function viewAllDepartments() {
  connection.promise().query(`SELECT * FROM department`)
    .then(([rows]) => {
      console.table(rows);
      startApp();
    })
}

//view all roles
//presented with the job title, role id, the department that role belongs to, 
//and the salary for that role
function viewAllRoles() {
  connection.promise().query(`SELECT * FROM role`)
    .then(([rows]) => {
      console.table(rows);
      startApp();
    })
}

//view all employees
//presented with a formatted table showing employee data, 
//including employee ids, first names, last names, job titles, 
//departments, salaries, and managers that the employees report to
function viewAllEmployees() {
  connection.promise().query(`SELECT employee.first_name, employee.last_name, role_id, manager_id FROM employee`)
    .then(([rows]) => {
      console.table(rows);
      startApp();
    })
}

//add a department
//prompted to enter the name of the department and that department 
//is added to the database
function addDepartment() {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter a name for the department.',
    validate: addDepartmentNameInput => {
      if (addDepartmentNameInput) {
        return true;
      } else {
        console.log("This department must have a name.");
      }
    }
  }).then(res => {
    connection.promise().query(`INSERT INTO department SET ?`, res)
      .then(() => {
        console.log('Added Department');
        startApp();
      })
  })
};

//add a role
//prompted to enter the name, salary, 
//and department for the role and that role is added to the database
function addRole() {
  connection.promise().query(`SELECT * FROM department`)
    .then(([rows]) => {
      const allDep = rows.map(row => ({ name: row.name, value: row.id }));
      inquirer.prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the name for this role.',
          validate: addRoleNameInput => {
            if (addRoleNameInput) {
              return true;
            } else {
              console.log("This role must have a name.");
            }
          }
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for this role.',
          validate: addRoleSalaryInput => {
            if (addRoleSalaryInput) {
              return true;
            } else {
              console.log("This role must have a salary.");
            }
          }
        },
        {
          name: 'department_id',
          type: 'list',
          message: 'Enter the department for this role.',
          choices: allDep
        }
      ]).then(res => {
        connection.promise().query(`INSERT INTO role SET ?`, res)
          .then(() => {
            console.log('Added Role');
            startApp();
          })

      })
    })
};

function addEmployee() {
  let allRoles;
  let allEmp;
  connection.promise().query(`SELECT * FROM role`)
    .then(([rows]) => {
      allRoles = rows.map(row => ({ name: row.title, value: row.id }));
      return connection.promise().query(`SELECT * FROM employee`);
    })
    .then(([rows]) => {
      allEmp = rows.map(row => ({ name: row.first_name + ' ' + row.last_name, value: row.id }));
      return inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: "Enter the employee's first name.",
          validate: addEmpFirstNameInput => {
            if (addEmpFirstNameInput) {
              return true;
            } else {
              console.log("This employee must have a first name.");
            }
          }
        },
        {
          name: 'last_name',
          type: 'input',
          message: "Enter the employee's last name.",
          validate: addEmpLastNameInput => {
            if (addEmpLastNameInput) {
              return true;
            } else {
              console.log("This employee must have a last name.");
            }
          }
        },
        {
          name: 'role_id',
          type: 'list',
          message: "Enter the employee's role id.",
          choices: allRoles,
          validate: addEmpRoleIdInput => {
            if (addEmpRoleIdInput) {
              return true;
            } else {
              console.log("This employee must have a role id.");
            }
          }
        },
        {
          name: 'manager_id',
          type: 'list',
          message: "Enter the employee's Manager ID.",
          choices: allEmp,
          validate: addEmpManIdInput => {
            if (addEmpManIdInput) {
              return true;
            } else {
              console.log("This employee must have a Manager ID.");
            }
          }
        },
      ])
    })
    .then(res => {
      connection.promise().query(`INSERT INTO employee SET ?`, res)
        .then(() => {
          console.log('Added Employee');
          startApp();
        })
    })
};

//update an employee role
//prompted to select an employee to update and their new role 
//and this information is updated in the database 
function updateEmployeeRole() {
  connection.promise().query(`SELECT * FROM employee`)
    .then(([rows]) => {
      const allEmp = rows.map(row => ({ name: row.first_name + " " + row.last_name, value: row.id }))
      connection.promise().query(`SELECT * FROM role`)
        .then(([rows]) => {
          const allRole = rows.map(row => ({ name: row.title, value: row.id }))
          inquirer.prompt([
            {
              name: 'empId',
              type: 'list',
              message: 'Choose an employee to update.',
              choices: allEmp
            },
            {
              name: 'roleId',
              type: 'list',
              message: 'Choose employee\'s role.',
              choices: allRole
            }
          ]).then(res => {
            connection.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`,
              [res.roleId, res.empId])
              .then(() => {
                console.log('Updated employee\'s role.');
                startApp();
              })
          })
        })
    })
};

const startApp = () => {
  inquirer.prompt({
    name: "menu",
    type: 'list',
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role"
    ]
  })
  .then(response => {
    if (response.menu === "View All Departments") {
      viewAllDepartments();
    } else if (response.menu === "View All Roles") {
      viewAllRoles();
    } else if (response.menu === "View All Employees") {
      viewAllEmployees();
    } else if (response.menu === "Add A Department") {
      addDepartment();
    } else if (response.menu === "Add A Role") {
      addRole();
    } else if (response.menu === "Add An Employee") {
      addEmployee();
    } else if (response.menu === "Update An Employee Role") {
      updateEmployeeRole();
    } else {
      return ("You must select a valid option");
    }
  })
};

startApp();