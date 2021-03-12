const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

var departments;
var roles;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dolphin",
    port: 3306,
    database: "employee_db"
});

connection.connect( (err) => {
    if(err) throw err;    
    
    questions();
});

function questions(){ 
    
    connection.query("SELECT name, id FROM department", (err, results) => {
        if(err) return console.error(err);
        departments = results;
    });
    
    connection.query("SELECT title, id FROM role", (err, results) => {
        if(err) return console.error(err);
        roles = results;
    });
    
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: ["Update Employee", "Add User", "Add Role", "Add Department", "View Employees", "Exit"]
        }
    ])
    .then( answers => {
        const {choice} = answers;

        if(choice === "Update Employee"){
            getEmployeeList();
        }
        else if(choice === "Add User"){
            newUser();
        }
        else if(choice === "Add Role"){
            newRole();
        }
        else if(choice === "Add Department"){
            newDepartment();
        }
        else if(choice === "View Employees"){
            viewUsers();
        }
        else{
            connection.end();
        }
    })
}

function getEmployeeList(){
    connection.query("SELECT * FROM employee", (err, results) => {
        if(err) return console.error(err);
        getUpdateInfo(results);
    });

    
}

function getUpdateInfo(records){
    
    records = records.map(dbData => {
        return { name: dbData.first_name + " " + dbData.last_name, value: {...dbData}};
    });

    roleChoices = roles.map(dbData => {
        return { name: dbData.title, value: dbData.id};
    });

    inquirer.prompt([
        {
            type: "list",
            message: "What Employee would you like to update?",
            name: "chosen",
            choices: records
        },
        {
            type: "list",
            message: "What is the new Role?",
            name: "role",
            choices: roleChoices
        }
    ])
    .then(answers => {
        let {chosen, role} = answers;
        role = parseInt(role);      
        updateEmployee(chosen, role);      
    })
}

function updateEmployee(chosen, role){
    const setValue = { role_id: role };
    const whereValue = { id: chosen.id }
    connection.query("UPDATE employee SET ? WHERE ?", [setValue, whereValue], err => {
        if(err) return console.error(err);
        console.log("Employee Updated");

        questions();
    });
}

function newUser(){
    roleChoices = roles.map(dbData => {
        return { name: dbData.title, value: dbData.id};
    });
    
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the user's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "How about their last name?"
        },
        {
            type: "list",
            message: "What is their Role?",
            name: "role_id",
            choices: roleChoices
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is the Manager ID?"
        },

    ])
    .then(answers => {
        answers.role_id = parseInt(answers.role_id);
        answers.manager_id = parseInt(answers.manager_id);

        connection.query("INSERT employee SET ?", answers, err => {
            if(err) return console.error(err);
            console.log("Employee created.");

            questions();
        });
    });
}

function viewUsers(){
    connection.query("SELECT * FROM employee", (err, results) => {
        if(err) return console.error(err);
        
        console.table(results)
        questions();
    });
}

function newRole(){
    
    departmentChoices = departments.map(dbData => {
        return { name: dbData.name, value: dbData.id};
    });
    
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the role title?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary?"
        },
        {
            type: "list",
            message: "What is Department is this role under?",
            name: "department_id",
            choices: departmentChoices
        }


    ])
    .then(answers => {
        answers.department_id = parseInt(answers.department_id);
        answers.salary = parseInt(answers.salary);

        connection.query("INSERT role SET ?", answers, err => {
            if(err) return console.error(err);
            console.log("Role created.");

            questions();
        });
    });
}

function newDepartment(){
    
    
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the Department name?"
        }

    ])
    .then(answers => {
        connection.query("INSERT department SET ?", answers, err => {
            if(err) return console.error(err);
            console.log("Department created.");

            questions();
        });
    });
}


