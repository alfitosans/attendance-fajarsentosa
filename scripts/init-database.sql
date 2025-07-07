-- Create tables for the attendance system
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'guru', 'murid')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_students (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id),
  student_id INTEGER REFERENCES users(id),
  UNIQUE(class_id, student_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id),
  student_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('hadir', 'tidak_hadir', 'izin', 'sakit')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, student_id, date)
);

-- Insert sample data
INSERT INTO users (name, email, password, role) VALUES
('Admin System', 'admin@school.com', 'admin123', 'admin'),
('Pak Budi', 'budi@school.com', 'guru123', 'guru'),
('Bu Sari', 'sari@school.com', 'guru123', 'guru'),
('Ahmad Rizki', 'ahmad@school.com', 'murid123', 'murid'),
('Siti Nurhaliza', 'siti@school.com', 'murid123', 'murid'),
('Budi Santoso', 'budis@school.com', 'murid123', 'murid');

INSERT INTO classes (name, description, teacher_id) VALUES
('Matematika Kelas 10A', 'Kelas Matematika untuk siswa kelas 10A', 2),
('Bahasa Indonesia Kelas 10A', 'Kelas Bahasa Indonesia untuk siswa kelas 10A', 3),
('Fisika Kelas 10B', 'Kelas Fisika untuk siswa kelas 10B', 2);

INSERT INTO class_students (class_id, student_id) VALUES
(1, 4), (1, 5), (1, 6),
(2, 4), (2, 5),
(3, 6);
