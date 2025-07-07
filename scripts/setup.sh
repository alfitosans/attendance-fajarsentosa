#!/bin/bash

echo "🚀 Setting up Sistem Absensi Sekolah..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating .env.local file..."
    cp .env.example .env.local
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env.local with generated JWT secret
    sed -i.bak "s/your-super-secret-jwt-key-minimum-32-characters-long/$JWT_SECRET/" .env.local
    rm .env.local.bak 2>/dev/null || true
    
    echo "🔑 JWT Secret generated and added to .env.local"
    echo "📝 Please edit .env.local and update DATABASE_URL if needed"
else
    echo "✅ .env.local already exists"
fi

# Check if database connection works
echo "🔍 Testing database connection..."
node -e "
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
sql\`SELECT 1 as test\`.then(() => {
    console.log('✅ Database connection successful');
}).catch(err => {
    console.log('❌ Database connection failed:', err.message);
    console.log('Please check your DATABASE_URL in .env.local');
});
" 2>/dev/null || echo "⚠️ Database connection test skipped (dependencies not ready)"

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and update your configuration"
echo "2. Run database setup: Execute scripts/init-database-secure.sql in your Neon console"
echo "3. Start development server: npm run dev"
echo "4. Open http://localhost:3000"
echo ""
echo "Demo accounts:"
echo "- Admin: admin@school.com / admin123"
echo "- Guru: budi@school.com / guru123"
echo "- Murid: ahmad@school.com / murid123"
