CREATE TYPE os AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS developer_infos (
	id SERIAL PRIMARY KEY,
	developer_since DATE NOT NULL,
	preferred_os os NOT NULL,
	developer_id INT
);

CREATE TABLE IF NOT EXISTS developers (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	developer_info_id INT
);

CREATE TABLE IF NOT EXISTS projects (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	estimated_time VARCHAR(20) NOT NULL,
	repository VARCHAR(120) NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE,
	developer_id INT
);

CREATE TABLE IF NOT EXISTS technologies (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects_technologies (
	id SERIAL PRIMARY KEY,
	project_id INT NOT NULL,
	technology_id INT NOT NULL,
	added_in DATE NOT NULL
);

INSERT INTO technologies (name)
VALUES
  ('JavaScript'),
  ('Python'),
  ('React'),
  ('Express.js'),
  ('HTML'),
  ('CSS'),
  ('Django'),
  ('PostgreSQL'),
  ('MongoDB');
  
ALTER TABLE developer_infos
ADD CONSTRAINT fk_developer_id
FOREIGN KEY (developer_id)
REFERENCES developers (id)
ON DELETE CASCADE;
 
ALTER TABLE developers
ADD CONSTRAINT fk_developer_info_id
FOREIGN KEY (developer_info_id)
REFERENCES developer_infos (id)
ON DELETE CASCADE;

ALTER TABLE projects
ADD CONSTRAINT fk_project_developer_id
FOREIGN KEY (developer_id)
REFERENCES developers (id)
ON DELETE CASCADE;

ALTER TABLE projects_technologies
ADD CONSTRAINT fk_project_id
FOREIGN KEY (project_id)
REFERENCES projects (id);

ALTER TABLE projects_technologies
ADD CONSTRAINT fk_technology_id
FOREIGN KEY (technology_id)
REFERENCES technologies (id);