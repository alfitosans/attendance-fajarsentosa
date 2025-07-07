# Sistem Absensi Sekolah

Sistem absensi berbasis web untuk sekolah dengan role-based access untuk Admin, Guru, dan Murid.

## 🚀 Fitur

- **Authentication & Authorization**: Login dengan role-based access
- **Dashboard Admin**: Kelola pengguna, kelas, dan monitoring sistem
- **Dashboard Guru**: Input absensi dan kelola kelas yang diampu
- **Dashboard Murid**: Lihat riwayat absensi dan statistik kehadiran
- **Database Integration**: PostgreSQL dengan Drizzle ORM
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT dengan secure cookies

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- npm atau yarn

## 🔧 Installation

1. **Clone repository**
   \`\`\`bash
   git clone <repository-url>
   cd sistem-absensi
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` dengan konfigurasi Anda:
   \`\`\`env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-jwt-secret-minimum-32-characters"
   \`\`\`

4. **Setup database**
   - Jalankan script SQL: `scripts/init-database-secure.sql`
   - Atau gunakan Drizzle migrations

5. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🔐 Demo Accounts

- **Admin**: admin@school.com / admin123
- **Guru**: budi@school.com / guru123
- **Murid**: ahmad@school.com / murid123

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard pages
│   └── login/            # Login page
├── components/            # React components
├── lib/                  # Utilities & configurations
│   ├── auth.ts           # Authentication logic
│   ├── config.ts         # Environment configuration
│   └── db/               # Database schema & connection
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. **Deploy**

### Manual Deployment

1. **Build application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization
- Input validation & sanitization
- SQL injection protection
- XSS protection
- Secure cookie settings
- Environment variable validation

## 📊 Database Schema

- **users**: Admin, Guru, Murid dengan role-based access
- **classes**: Kelas dengan guru pengampu
- **class_students**: Relasi many-to-many kelas-siswa
- **attendance**: Record absensi dengan status dan catatan

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 📞 Support

Untuk bantuan atau pertanyaan, silakan buat issue di repository ini.
