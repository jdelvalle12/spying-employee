DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employees_db;

CREATE TABLE deprtment (
  id: INT PRIMARY KEY,
  _name: VARCHAR(30) NOT NULL 
);

CREATE TABLE role (
    id: INT PRIMARY KEY,
    title: VARCHAR(30),
    salary: DECIMAL,
    DEPARTMENT_id: INT
);

CREATE TABLE employee (
  id: INT PRIMARY KEY,
  first_name: VARCHAR(30),
  last_name: VARCHAR(30),
  role_id: INT,
  manager_id: INT
);

