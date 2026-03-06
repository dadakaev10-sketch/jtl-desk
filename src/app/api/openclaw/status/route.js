import { NextResponse } from 'next/server'

export async function GET() {
  const bridgeUrl = process.env.OPENCLAW_BRIDGE_URL
  if (!bridgeUrl) return NextResponse.json({ status: 'idle' })

  try {
    const res = await fetch(`${bridgeUrl}/ping`, {
      signal: AbortSignal.timeout(5000),
      headers: { 'x-bridge-secret': process.env.OPENCLAW_BRIDGE_SECRET },
    })
    return NextResponse.json({ status: res.ok ? 'active' : 'error' })
  } catch {
    return NextResponse.json({ status: 'error' })
  }
}
