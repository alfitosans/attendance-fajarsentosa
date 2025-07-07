# 🚀 Panduan Setup Local Development

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** versi 18 atau lebih baru
- **npm** atau **yarn** atau **pnpm**
- **Git**

## 🔧 Langkah-langkah Setup

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/your-username/attendance-fajarsentosa.git
cd attendance-fajarsentosa
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
\`\`\`

### 3. Setup Environment Variables

\`\`\`bash
# Copy file environment template
cp .env.example .env.local
\`\`\`

Edit file `.env.local` dan isi dengan konfigurasi Anda:

\`\`\`env
# Database - Gunakan connection string Neon yang sudah disediakan
DATABASE_URL="postgresql://neondb_owner:npg_ol2pcxjRd5Ob@ep-wandering-forest-a152nisj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret - Generate secret yang kuat
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Application URL
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### 4. Generate JWT Secret

Untuk keamanan, generate JWT secret yang kuat:

\`\`\`bash
# Menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Atau menggunakan OpenSSL
openssl rand -hex 32
\`\`\`

Copy hasil generate dan masukkan ke `JWT_SECRET` di file `.env.local`

### 5. Setup Database

Jalankan script SQL untuk membuat tabel dan data demo:

\`\`\`bash
# Jika menggunakan psql (opsional)
psql "postgresql://neondb_owner:npg_ol2pcxjRd5Ob@ep-wandering-forest-a152nisj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" -f scripts/init-database-secure.sql
\`\`\`

**Atau** jalankan script melalui Neon Console:
1. Buka [Neon Console](https://console.neon.tech)
2. Pilih database Anda
3. Buka SQL Editor
4. Copy-paste isi file `scripts/init-database-secure.sql`
5. Execute script

### 6. Jalankan Development Server

\`\`\`bash
npm run dev
\`\`\`

Aplikasi akan berjalan di: **http://localhost:3000**

### 7. Test Login

Gunakan akun demo untuk testing:

- **Admin**: 
  - Email: `admin@school.com`
  - Password: `admin123`

- **Guru**: 
  - Email: `budi@school.com`
  - Password: `guru123`

- **Murid**: 
  - Email: `ahmad@school.com`
  - Password: `murid123`

## 🛠️ Commands Berguna

\`\`\`bash
# Development
npm run dev          # Jalankan development server
npm run build        # Build untuk production
npm run start        # Jalankan production server
npm run lint         # Check linting

# Database (jika menggunakan Drizzle Kit)
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database

# Type checking
npm run type-check   # Check TypeScript types
\`\`\`

## 🔍 Troubleshooting

### Error: "No database connection string"
- Pastikan `DATABASE_URL` sudah diset di `.env.local`
- Restart development server setelah menambah environment variables

### Error: "JWT_SECRET is required"
- Generate JWT secret dan tambahkan ke `.env.local`
- Pastikan secret minimal 32 karakter

### Error: Database connection failed
- Cek koneksi internet
- Pastikan connection string Neon benar
- Cek apakah database masih aktif di Neon Console

### Error: Login gagal
- Pastikan database sudah di-seed dengan data demo
- Cek console browser untuk error details
- Pastikan API routes berjalan dengan benar

### Port 3000 sudah digunakan
\`\`\`bash
# Jalankan di port lain
npm run dev -- -p 3001
\`\`\`

## 📁 Struktur Project

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin endpoints
│   │   ├── guru/          # Teacher endpoints
│   │   └── murid/         # Student endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities & configurations
│   ├── auth.ts           # Authentication logic
│   ├── config.ts         # Environment configuration
│   ├── db/               # Database schema & connection
│   └── utils.ts          # Utility functions
├── scripts/              # Database scripts
├── public/               # Static assets
├── .env.local            # Environment variables (local)
├── .env.example          # Environment template
└── README.md             # Documentation
\`\`\`

## 🚀 Ready to Go!

Setelah semua langkah di atas, aplikasi sistem absensi sudah siap digunakan di local environment!

Untuk deployment ke production, lihat panduan di `README.md`.
