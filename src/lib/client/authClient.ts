export async function signup(email: string, password: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('token', token)
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export async function me() {
  const token = getToken()
  if (!token) return null
  const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  return res.json()
}
