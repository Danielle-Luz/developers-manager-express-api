CREATE TYPE "os" AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS "developerInfos" (
	id SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" "os" NOT NULL,
	"developerId" INT
);

CREATE TABLE IF NOT EXISTS "developers" (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	"developerInfoId" INT
);

CREATE TABLE IF NOT EXISTS "projects" (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	repository VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INT
);

CREATE TABLE IF NOT EXISTS "technologies" (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS "projectsTechnologies" (
	id SERIAL PRIMARY KEY,
	"projectId" INT NOT NULL,
	"technologyId" INT NOT NULL,
	"addedIn" DATE NOT NULL
);

INSERT INTO "technologies" ("name")
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
  
ALTER TABLE "developerInfos"
ADD CONSTRAINT "fkDeveloperId"
FOREIGN KEY ("developerId")
REFERENCES "developers" (id)
ON DELETE CASCADE;
 
ALTER TABLE "developers"
ADD CONSTRAINT "fkDeveloperInfoId"
FOREIGN KEY ("developerInfoId")
REFERENCES "developerInfos" (id)
ON DELETE CASCADE;

ALTER TABLE "projects"
ADD CONSTRAINT "fkProjectDeveloperId"
FOREIGN KEY ("developerId")
REFERENCES "developers" (id)
ON DELETE CASCADE;

ALTER TABLE "projectsTechnologies"
ADD CONSTRAINT "fkProjectId"
FOREIGN KEY ("projectId")
REFERENCES "projects" (id);

ALTER TABLE "projectsTechnologies"
ADD CONSTRAINT "fkTechnologyId"
FOREIGN KEY ("technologyId")
REFERENCES "technologies" (id);