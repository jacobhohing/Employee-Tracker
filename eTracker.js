const inquirer = require("inquirer");
const mysql = require("mysql");

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
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to add, view, or update an employee record?",
            name: "choice",
            choices: ["Update", "Add", "View", "Exit"]
        }
    ])
    .then( answers => {
        const {choice} = answers;

        if(choice === "Update"){
            getEmployeeList();
        }
        else if(choice === "Add"){
            addUser();
        }
        else if(choice === "View"){
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
    // and then ask the user which one to bid on
    inquirer.prompt([
        {
            type: "list",
            message: "What Employee would you like to update with a new Manager ID?",
            name: "chosen",
            choices: records
        },
        {
            type: "input",
            message: "What is the new Manager ID?",
            name: "manager"
        }
    ])
    .then(answers => {
        let {chosen, manager} = answers;
        manager = parseInt(manager);
        
        updateEmployee(chosen, manager);
        
    })
}

function updateEmployee(chosen, manager){
    const setValue = { manager_id: manager };
    const whereValue = { id: chosen.id }
    connection.query("UPDATE employee SET ? WHERE ?", [setValue, whereValue], err => {
        if(err) return console.error(err);
        console.log("Employee Updated");

        questions();
    });
}

function addUser(){

}

function viewUsers(){

}

// function getEmployeeList(){
//     connection.query("SELECT * FROM employee", (err, results) => {
//         if(err) return console.error(err);
//         (results);
//     });

//     updateUser(results);
// }