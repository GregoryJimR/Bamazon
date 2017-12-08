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
var departments = ["Footwear", "Clothing", "Accessories"];
var displayedProducts = [];
var departmentChoice = "";
//var unitPrice = "";
var status = "";
var orderChoice = "";
var orderQuantity;
var productQuantity;

function reduceInventory() {
    console.log("reducing quantity by " + orderQuantity + "...\n");
    var newQuantity = productQuantity - orderQuantity;
    console.log("new quantity: " + newQuantity);
    var query = "Update products SET ? Where?";
    connection.query(query, [{
                stock_quantity: newQuantity
            },
            {
                product_name: orderChoice
            }
        ],
        function(err, res) {
            console.log("products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes

        });
}

function start() {
    inquirer
        .prompt({
            name: "greeting",
            type: "list",
            message: "Would you like to place an order?",
            choices: ["YES", "NO"]
        }).then(function(response) {
            if (response.greeting === "YES") {
                inquirer
                    .prompt({
                        name: "displayType",
                        type: "list",
                        message: "Would you like to view all products or search by department?",
                        choices: ["Show All", "Show by department"]
                    }).then(function(response) {
                        if (response.displayType === "Show All") {
                            displayAllProducts();
                        }
                        else {
                            //displayProductsByCategory();
                            inquirer
                                .prompt({
                                    name: "departmentSelect",
                                    type: "list",
                                    message: "Select a department:",
                                    choices: departments
                                }).then(function(response) {
                                    console.log("this will run displayProductsByCategory()");
                                    departmentChoice = response.departmentSelect;
                                    displayProductsByDepartment();
                                });

                        }
                    });
            }
            else {
                console.log("Goodbye!");
                connection.end();
            }
        });
}

function orderProduct() {
    inquirer
        .prompt({
            name: "orderChoices",
            type: "list",
            choices: displayedProducts,
            message: "Please select the product you would like to order"
        }).then(function(response) {
            orderChoice = response.orderChoices;
            //console.log(response.orderChoices);
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { product_name: orderChoice }, function(err, res) {
                if (err) throw err;
                //console.log(res);
                if (res[0].stock_quantity > 0) {
                    var productChoice = res[0].product_name;
                    var productPrice = JSON.stringify(res[0].price);
                    productQuantity = res[0].stock_quantity;
                    //var productCost = res[0].price;
                    //console.log("Choice: " + productChoice + " Price: " + productPrice + " Cost: " + productCost);
                    console.log("You chose " + productChoice + " for $" + productPrice);
                    inquirer
                        .prompt({
                            name: "quantitySelect",
                            type: "input",
                            message: "how many would you like to order?"
                        }).then(function(orderResponse) {
                            orderQuantity = orderResponse.quantitySelect;
                            var totalPrice = (parseInt(orderQuantity) * productPrice);
                            var orderMessage = "Confirm order of " + orderQuantity + " " + orderChoice + " for a total of $" + totalPrice;
                            inquirer
                                .prompt({
                                    name: "completeOrder",
                                    type: "list",
                                    message: "Please select one of the following:",
                                    choices: [orderMessage, "Start over", "Exit Bamazon"]
                                }).then(function(confirmationResponse) {
                                    switch (confirmationResponse.completeOrder) {
                                        case orderMessage:
                                            console.log("------ Congratualtions on your order ------");
                                            console.log("run reduceInventory");
                                            reduceInventory();
                                            start();
                                            break;
                                        case "Start over":
                                            start();
                                            break;
                                        case "Exit Bamazon":
                                            connection.end();
                                    }
                                });
                        });
                }
                else {
                    console.log("Sorry, this item is sold out.  Please try again later.");
                    start();
                }
            });
        });
}


function displayAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //for loop to run through res and display property, name and price
        //displayedProducts = [];
        for (var i = 0; i < res.length; i++) {
            displayedProducts.push(res[i].product_name);
            if (res[i].stock_quantity > 0) {
                status = "AVAILABLE";
                console.log(res[i].item_id + " " + res[i].product_name + " Price: $" + res[i].price + " ----- Product is " + status);
            }
            else {
                status = "SOLD OUT";
                console.log(res[i].item_id + " " + res[i].product_name + " Price: $" + res[i].price + " ----- Product is " + status + " please check back later.");
            }
        }
        orderProduct();
    });
}

function displayProductsByDepartment() {
    console.log("departmentChoice inside displayProductsByDepartment()" + departmentChoice);
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { department: departmentChoice }, function(err, res) {
        if (err) throw err;
        //displayedProducts = [];
        for (var i = 0; i < res.length; i++) {
            displayedProducts.push(res[i].product_name);
            if (res[i].stock_quantity > 0) {
                var status = "AVAILABLE";
                console.log(res[i].item_id + " " + res[i].product_name + " Price: $" + res[i].price + " ----- Product is " + status);
            }
            else {
                status = "SOLD OUT";
                console.log(res[i].item_id + " " + res[i].product_name + " Price: $" + res[i].price + " ----- Product is " + status + " please check back later.");
            }
        }
        orderProduct();

    });

    //this should create an array of department options and set the array as choices for the user to select.  depending on the choice, a query will run for all rows WHERE department is equal to that choice.  It will display all items and then orderProduct() will run
}
