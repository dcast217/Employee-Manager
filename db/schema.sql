DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;



CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
 id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);



-- ALTER TABLE employee
-- ADD COLUMN manager_id INT,
-- ADD FOREIGN KEY (manager_id) REFERENCES employee(id);


-- UPDATE employee
-- SET manager_id = <new_manager_id>
-- WHERE id = <employee_id>;

-- SELECT * FROM employee
-- WHERE manager_id = <manager_id>;

-- SELECT * FROM employee
-- WHERE role_id IN (
--   SELECT id FROM role
--   WHERE department_id = <department_id>
-- );

-- DELETE FROM department
-- WHERE id = <department_id>;

-- DELETE FROM role
-- WHERE id = <role_id>;

-- DELETE FROM employee
-- WHERE id = <employee_id>;

-- SELECT SUM(salary) AS total_budget
-- FROM employee
-- JOIN role ON employee.role_id = role.id
-- WHERE role.department_id = <department_id>;