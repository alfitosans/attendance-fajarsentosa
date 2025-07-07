import { db, schema } from "./db"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { config, validateConfig } from "./config"

// Validate configuration on module load
validateConfig()

const key = new TextEncoder().encode(config.auth.jwtSecret)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${config.auth.sessionTimeout}s`)
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: "Email dan password harus diisi" }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { error: "Format email tidak valid" }
    }

    const users = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase())).limit(1)

    if (users.length === 0) {
      return { error: "Email atau password salah" }
    }

    const user = users[0]

    // For demo purposes, we'll use plain text comparison
    // In production, use bcrypt
    const isValidPassword = user.password === password

    if (!isValidPassword) {
      return { error: "Email atau password salah" }
    }

    const session = await encrypt({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    })

    const cookieStore = cookies()
    cookieStore.set("session", session, {
      expires: new Date(Date.now() + config.auth.sessionTimeout * 1000),
      httpOnly: true,
      secure: config.app.nodeEnv === "production",
      sameSite: "lax",
      path: "/",
    })

    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Terjadi kesalahan sistem" }
  }
}

export async function logout() {
  try {
    const cookieStore = cookies()
    cookieStore.set("session", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: config.app.nodeEnv === "production",
      sameSite: "lax",
      path: "/",
    })
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { error: "Gagal logout" }
  }
}

export async function getSession() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value
    if (!session) return null

    const payload = await decrypt(session)
    return payload
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session) return null

    const users = await db.select().from(schema.users).where(eq(schema.users.id, session.userId)).limit(1)
    if (users.length === 0) return null

    const user = users[0]
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }

  return user
}
