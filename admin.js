var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "",
    database: "bamazondb"
});

connection.connect(function(err) {
    if (err) throw (err);
    console.log("connected as id " + connection.threadID + "\n");
    start();
});

function start() {
    inquirer
        .prompt({
            name: "admin begin",
            type: "list",
            message: "Greetings, please select an option",
            choices: ["Update Inventory", "Exit"]
        }).then(function(response) {
            switch (response) {
                case "Update Inventory":
                    inquirer
                        .prompt({
                            name: "updateType",
                            type: "list",
                            message: "Would you like to update by item or return all inventory to par levels?",
                            choices: ["Inventory by Item", "Order to Par"]

                        }).then(function(response) {
                            console.log("options...");
                        });
            }
        });
}
