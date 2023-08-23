-- Departments --

INSERT INTO department (id, department_name)
VALUES  (1, 'Pathology'),
        (2, 'Radiology'),
        (3, 'Sonography'),
        (4, 'Cardiology');

-- Roles --

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Medical laboratory scientist', 70000.00, 1),
       (2, 'Medical laboratory technician', 55000.00, 1),
       (3, 'Specimen processer', 40000.00, 1),
       (4, 'Phlebotomist', 48000.00, 1),
       (5, 'Radiologist', 250000.00, 2),
       (6, 'Radiology technician', 70000.00, 2),
       (7, 'Radiation therapist', 85000.00, 2),
       (8, 'Ultrasound technnician', 88000.00, 3),
       (9, 'Ultrasound technologist', 120000.00, 3),
       (10, 'Vice President sonographer', 150000.00, 3),
       (11, 'Pediatric sonographer', 125000.00, 3),
       (12, 'Cardiologist', 275000.00, 4),
       (13, 'Respiratory therapist', 65000.00, 4),
       (14, 'Cardiology consultant', 112000.00, 4),
       (15, 'Cardiovascular technician', 62000.00, 4);

-- Employees --

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Michael', 'James', 1, null),
       (2, 'Brenda', 'Johnson', 2, 1),
       (3, 'Alicia', 'Savage', 3, 1),
       (4, 'Ivan', 'Menace', 4, 1),
       (5, 'Kimberly', 'Fletcher', 5, null),
       (6, 'David', 'Jones', 6, 5),
       (7, 'Vanessa', 'Carmichael', 7, 5),
       (8, 'Karen', 'Whitaker', 8, null),
       (9, 'John', 'Doe', 9, 8),
       (10, 'Jane', 'White', 10, 8),
       (11, 'Peter', 'Atkins', 11, 8),
       (12, 'Marcus', 'James', 12, null),
       (13, 'Abdul', 'Diallo', 13, 12),
       (14, 'Kadijah', 'Leigh', 14, 12),
       (15, 'Janah', 'Blooms', 15, 12);