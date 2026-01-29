import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/server'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    return NextResponse.json({ user: payload })
  } catch (err: any) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
}
