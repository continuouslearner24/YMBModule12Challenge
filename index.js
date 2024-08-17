const { Pool } = require("pg");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const pool = new Pool(
  {
    database: "company_db",
  },
  () => console.log("Company database connected."),
);

function mainMenu() {
  prompt([
    {
      type: "list",
      message: "Select your choice?",
      name: "userChoice",
      choices: ["View Departments", "Add Department", "View Roles", "Add Role", "View Employees", "Add Employee", "Update Employee Role"],
    },
  ]).then((res) => {
    if (res.userChoice === "View Departments") {
      viewDepartment();
    } else if (res.userChoice === "Add Department") {
      addDepartment();
    } else if (res.userChoice === "View Roles") {
      viewRole();
    } else if (res.userChoice === "Add Role") {
      addRole();
    } else if (res.userChoice === "View Employees") {
      viewEmployee();
    } else if (res.userChoice === "Add Employee") {
      addEmployee();
    } else if (res.userChoice === "Update Employee Role") {
      updateEmployeeRole();
    } else {
      console.log("Wrong choice");
    }
  });
}

function viewTable(tableName) {
  const sql = `SELECT * FROM ${tableName}`;
  console.log("\n" + tableName);
  pool.query(sql, (err, { rows }) => {
    console.table(rows);
    mainMenu();
  });
}

// To use the function for specific tables:
viewTable("department");
viewTable("role");
viewTable("employee");

function addDepartment() {
  try {
    const { newDepartment } = prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "newDepartment",
      },
    ]);

    const sql = "INSERT INTO department (name) VALUES ($1)";
    pool.query(sql, [newDepartment]);
    console.log("Department added successfully!");
  } catch (error) {
    console.error("Error adding department:", error);
  } finally {
    mainMenu();
  }
}

function addRole() {
  try {
    const { rows: departments } = pool.query("SELECT * FROM department");
    const departmentChoices = departments.map(({ id, name }) => ({ name, value: id }));

    const { roleTitle, roleSalary, roleDepartment } = prompt([
      {
        type: "input",
        message: "Which Role do you want to add?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "What is the salary?",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department does this role belong to?",
        name: "roleDepartment",
        choices: departmentChoices,
      },
    ]);

    const sql = "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)";
    pool.query(sql, [roleTitle, roleSalary, roleDepartment]);
    console.log("Role added successfully!");
  } catch (error) {
    console.error("Error adding role:", error);
  } finally {
    mainMenu();
  }
}

function addEmployee() {
  try {
    const { rows: roles } = pool.query("SELECT * FROM role");
    const roleChoices = roles.map(({ id, title }) => ({ name: title, value: id }));

    const { rows: employees } = pool.query("SELECT * FROM employee");
    const employeeChoices = employees.map(({ id, last_name }) => ({ name: last_name, value: id }));

    const { employeeFName, employeeLName, employeeRole, employeeManager } = prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "employeeFName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "employeeLName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "employeeRole",
        choices: roleChoices,
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "employeeManager",
        choices: employeeChoices,
      },
    ]);

    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)";
    pool.query(sql, [employeeFName, employeeLName, employeeRole, employeeManager]);
    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    mainMenu();
  }
}

// Start the application
mainMenu();
