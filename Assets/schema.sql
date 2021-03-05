-- database employee_db
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INTEGER auto_increment NOT NULL,
    name VARCHAR(30) NOT NULL,
    
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INTEGER auto_increment NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    department_id INTEGER,
    
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INTEGER auto_increment NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    
    PRIMARY KEY(id)
);
