import { NextResponse } from 'next/server'
import { testJTLConnection } from '@/lib/jtl-api'

export async function POST(request) {
  const { apiKey, apiUrl } = await request.json()
  const result = await testJTLConnection({ apiKey, apiUrl })
  return NextResponse.json(result)
}
