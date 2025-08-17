INSERT INTO projects (name, description) VALUES
('Website Redesign', 'Refresh the company website UI'),
('Mobile App', 'Build MVP for Android/iOS'),
('Internal Tools', 'Automate reporting');

INSERT INTO tasks (project_id, title, description, status) VALUES
(1, 'Audit current pages', 'List components and pages', 'done'),
(1, 'Design new navbar', 'Figma prototype', 'in_progress'),
(2, 'Define API contracts', 'OpenAPI draft', 'todo'),
(2, 'Implement auth', 'JWT-based', 'todo'),
(3, 'CI pipeline', 'Add lint/test/build', 'in_progress');
