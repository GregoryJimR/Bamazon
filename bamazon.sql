DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department VARCHAR(30) DEFAULT "none",
    price INT(5) NOT NULL,
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY (item_id)
)

INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Boots", 150, "Footwear", 40);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Hat", 15, "Accessories", 30);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Shoes", 100, "Footwear", 50);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Sunglasses", 120, "Accessories", 20);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Watch", 200, "Accessories", 10);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Shirt", 25, "Clothing", 100);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Pants", 50, "Clothing", 100);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Jacket", 150, "Clothing", 50);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Gloves", 15, "Accessories", 30);
INSERT INTO products (product_name, price, department, stock_quantity)
VALUES ("Socks", 10, "Footwear", 100);