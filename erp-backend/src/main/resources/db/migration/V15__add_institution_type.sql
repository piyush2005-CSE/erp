ALTER TABLE users ADD COLUMN institution_type VARCHAR(20) DEFAULT 'COLLEGE';
ALTER TABLE departments ADD COLUMN institution_type VARCHAR(20) DEFAULT 'COLLEGE';
ALTER TABLE programs ADD COLUMN institution_type VARCHAR(20) DEFAULT 'COLLEGE';
ALTER TABLE students ADD COLUMN institution_type VARCHAR(20) DEFAULT 'COLLEGE';
ALTER TABLE faculty ADD COLUMN institution_type VARCHAR(20) DEFAULT 'COLLEGE';
ALTER TABLE courses ADD COLUMN institution_type VARCHAR(20) DEFAULT 'COLLEGE';

-- Update existing records to COLLEGE if null
UPDATE users SET institution_type = 'COLLEGE' WHERE institution_type IS NULL;
UPDATE departments SET institution_type = 'COLLEGE' WHERE institution_type IS NULL;
UPDATE programs SET institution_type = 'COLLEGE' WHERE institution_type IS NULL;
UPDATE students SET institution_type = 'COLLEGE' WHERE institution_type IS NULL;
UPDATE faculty SET institution_type = 'COLLEGE' WHERE institution_type IS NULL;
UPDATE courses SET institution_type = 'COLLEGE' WHERE institution_type IS NULL;
