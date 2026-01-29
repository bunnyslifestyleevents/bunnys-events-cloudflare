import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const USERS_DB = path.join(process.cwd(), 'src', 'data', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export type User = {
  id: string
  email: string
  passwordHash: string
}

async function readUsers(): Promise<User[]> {
  try {
    const txt = await fs.readFile(USERS_DB, 'utf8')
    return JSON.parse(txt || '[]') as User[]
  } catch (err) {
    return []
  }
}

async function writeUsers(users: User[]) {
  await fs.writeFile(USERS_DB, JSON.stringify(users, null, 2), 'utf8')
}

export async function findUserByEmail(email: string) {
  const users = await readUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function createUser(email: string, password: string) {
  const existing = await findUserByEmail(email)
  if (existing) throw new Error('User already exists')

  const passwordHash = await bcrypt.hash(password, 10)
  const users = await readUsers()
  const user = { id: Date.now().toString(), email, passwordHash }
  users.push(user)
  await writeUsers(users)
  const { passwordHash: _p, ...publicUser } = user as any
  return publicUser
}

export async function verifyCredentials(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  const { passwordHash, ...publicUser } = user as any
  return publicUser
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}
