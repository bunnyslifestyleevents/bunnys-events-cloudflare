import { NextResponse } from 'next/server'
import { createUser, signToken } from '@/lib/auth/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await createUser(email, password)
    const token = signToken({ id: user.id, email: user.email })

    return NextResponse.json({ user, token }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 400 })
  }
}
