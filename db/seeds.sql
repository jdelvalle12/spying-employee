INSERT INTO department (id, _name)
VALUES (1, "Sales"),
       (2, "Sales"),
       (3, "Engineering"),
       (4, "Engineering"),
       (5, "Finance"),
       (6, "Finance"),
       (7, "Legal"),
       (8, "Legal");
       
INSERT INTO role (id, title, salary, department_id)
VALUES (01, "Sales Lead",100000, 1),
       (02, "Salesperson",80000, 2),
       (03, "Lead Engineer",150000, 3),
       (04, "Software Engineer",120000, 4),
       (05, "Account Manager",160000, 5),
       (06, "Accountant",125000, 6),
       (07, "Legal Team Lead",250000, 7),
       (08, "Lawyer ",190000, 8);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Jose","Del Valle" , 01, "null"),
       (002, "Mike","Chan" , 02, "Jose Del Valle "),
       (003, "Ashley","Rodriguez" , 03, "null"),
       (004, "Kevin","Tupik" , 04, "Ashley Rodriguez"),
       (005, "Kunal","Singh" , 05, "null"),
       (006, "Malia","Brown" , 06, "Kunal Singh"),
       (007, "Sarah","Lourd" , 07, "null"),
       (008, "Tom","Allen" , 08, "Sarah Lourd");