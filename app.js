//download and get client

const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { response } = require('express');

// create connection to database
const connection = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  database: 'employeeDB'
}

function startApp() {
  inquirer.prompt({
    name: "menu",
    type: 'list',
    message: "What would you like to do?"
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees"
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role",
      "Update Employee Managers",
      "View Employees By Manager",
      "Delete Departments"
      "Delete Role",
      "Delete Employees",
      "View Department Budget"
    ]
  }).then(responses => {
    if(responses.menu === "View All Departments"){
      showDepartments();
      break;
    }else if(responses.menu === "View All Roles"){
      showRoles();
      break;
    }else if(responses.menu === "View All Employees"){
      showEmployees();
      break;
    }else if(response.menu === "Add A Department"){
      addDepartment();
      break;
    }else if(response.menu === "Add A Role"){
      addRole();
      break;
    } else if(response.menu === "Add An Employee"){
      addEmployee();
      break;
    } else if(response.menu === "Add An Employee Role"){
      addEmployeeRole();
      break;
    } else if(response.menu === "Update Employee Managers"){
      updateEmployeeManager();
      break;
    } else if(response.menu === "View Employees By Manager"){
      viewEmployeeByManager();
      break;
    } else if(response.menu === "Delete Departments"){
      deleteDepartments();
      break;
    } else if(response.menu === "Delete Role"){
      deleteRole();
      break;
    } else if(response.menu === "Delete Employee"){
      deleteEmployee();
      break;
    } else if(response.menu === "View Department Budget"){
      viewDepartmentBudget();
      break
    } else {
      return ("You must select a valid option");
    }
  })
}

startApp();

//When starting application you are presented with the following:
//view all departments
    //presented with a formatted table showing department names and department ids
//view all roles
    //presented with the job title, role id, the department that role belongs to, and the salary for that role
//view all employees
    //presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
//add a department
    //prompted to enter the name of the department and that department is added to the database 
//add a role
    //prompted to enter the name, salary, and department for the role and that role is added to the database
//add an employee
    //prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
//update an employee role
    //prompted to select an employee to update and their new role and this information is updated in the database 

