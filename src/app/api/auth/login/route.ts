import { NextResponse } from 'next/server'
import { verifyCredentials, signToken } from '@/lib/auth/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await verifyCredentials(email, password)
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: user.id, email: user.email })
    return NextResponse.json({ user, token })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 400 })
  }
}
