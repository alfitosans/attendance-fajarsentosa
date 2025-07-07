-- Create tables for the attendance system with proper constraints
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL CHECK (length(name) >= 2),
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'guru', 'murid')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL CHECK (length(name) >= 3),
  description TEXT,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_students (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, student_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL CHECK (date <= CURRENT_DATE),
  status VARCHAR(20) NOT NULL CHECK (status IN ('hadir', 'tidak_hadir', 'izin', 'sakit')),
  notes TEXT CHECK (length(notes) <= 500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, student_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with validation
INSERT INTO users (name, email, password, role) VALUES
('Admin System', 'admin@school.com', 'admin123', 'admin'),
('Pak Budi Santoso', 'budi@school.com', 'guru123', 'guru'),
('Bu Sari Dewi', 'sari@school.com', 'guru123', 'guru'),
('Ahmad Rizki', 'ahmad@school.com', 'murid123', 'murid'),
('Siti Nurhaliza', 'siti@school.com', 'murid123', 'murid'),
('Budi Pratama', 'budis@school.com', 'murid123', 'murid'),
('Dewi Sartika', 'dewi@school.com', 'murid123', 'murid'),
('Rudi Hermawan', 'rudi@school.com', 'murid123', 'murid')
ON CONFLICT (email) DO NOTHING;

INSERT INTO classes (name, description, teacher_id) VALUES
('Matematika Kelas 10A', 'Kelas Matematika untuk siswa kelas 10A - Semester Ganjil', 2),
('Bahasa Indonesia Kelas 10A', 'Kelas Bahasa Indonesia untuk siswa kelas 10A - Semester Ganjil', 3),
('Fisika Kelas 10B', 'Kelas Fisika untuk siswa kelas 10B - Semester Ganjil', 2),
('Kimia Kelas 10A', 'Kelas Kimia untuk siswa kelas 10A - Semester Ganjil', 3)
ON CONFLICT DO NOTHING;

INSERT INTO class_students (class_id, student_id) VALUES
(1, 4), (1, 5), (1, 6), (1, 7),
(2, 4), (2, 5), (2, 8),
(3, 6), (3, 7), (3, 8),
(4, 4), (4, 5), (4, 6)
ON CONFLICT (class_id, student_id) DO NOTHING;

-- Insert sample attendance data for the last 7 days
INSERT INTO attendance (class_id, student_id, date, status, notes) VALUES
-- Matematika Kelas 10A
(1, 4, CURRENT_DATE - INTERVAL '1 day', 'hadir', 'Aktif dalam diskusi'),
(1, 5, CURRENT_DATE - INTERVAL '1 day', 'hadir', 'Mengerjakan tugas dengan baik'),
(1, 6, CURRENT_DATE - INTERVAL '1 day', 'tidak_hadir', 'Tanpa keterangan'),
(1, 7, CURRENT_DATE - INTERVAL '1 day', 'izin', 'Ada keperluan keluarga'),

(1, 4, CURRENT_DATE - INTERVAL '2 days', 'hadir', NULL),
(1, 5, CURRENT_DATE - INTERVAL '2 days', 'sakit', 'Demam'),
(1, 6, CURRENT_DATE - INTERVAL '2 days', 'hadir', NULL),
(1, 7, CURRENT_DATE - INTERVAL '2 days', 'hadir', NULL),

-- Bahasa Indonesia Kelas 10A
(2, 4, CURRENT_DATE - INTERVAL '1 day', 'hadir', 'Presentasi bagus'),
(2, 5, CURRENT_DATE - INTERVAL '1 day', 'hadir', NULL),
(2, 8, CURRENT_DATE - INTERVAL '1 day', 'hadir', NULL),

-- Today's attendance
(1, 4, CURRENT_DATE, 'hadir', NULL),
(1, 5, CURRENT_DATE, 'hadir', NULL),
(1, 6, CURRENT_DATE, 'hadir', NULL),
(1, 7, CURRENT_DATE, 'tidak_hadir', NULL)
ON CONFLICT (class_id, student_id, date) DO NOTHING;
