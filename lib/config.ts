// Configuration file for environment variables
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionTimeout: Number.parseInt(process.env.SESSION_TIMEOUT || "86400"), // 24 hours
    bcryptRounds: Number.parseInt(process.env.BCRYPT_ROUNDS || "12"),
  },

  // Application
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Sistem Absensi",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
  },

  // Email (optional)
  email: {
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // File Upload (optional)
  upload: {
    maxSize: Number.parseInt(process.env.UPLOAD_MAX_SIZE || "5242880"), // 5MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(",") || ["jpg", "jpeg", "png", "pdf"],
  },
}

// Validation function
export function validateConfig() {
  const required = [
    { key: "DATABASE_URL", value: config.database.url },
    { key: "JWT_SECRET", value: config.auth.jwtSecret },
  ]

  const missing = required.filter(({ value }) => !value)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.map(({ key }) => key).join(", ")}`)
  }

  // Validate JWT secret length
  if (config.auth.jwtSecret && config.auth.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long")
  }
}
