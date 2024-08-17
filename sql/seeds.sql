INSERT INTO department (name)
VALUES ('Marketing'),
       ('Finance'),
       ('Information Security'),
       ('Tech Experts'),
       ('Call Center');

INSERT INTO role (title, salary, department_id)
VALUES ('Software Dev', 1000000, 4 );

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('YML', 'CEO', 1, 1);


