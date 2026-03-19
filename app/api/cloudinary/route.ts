import { NextRequest, NextResponse } from 'next/server'
import { getSignature } from '@/lib/cloudinary/upload'

export async function POST(request: NextRequest) {
  const { timestamp, signature } = await getSignature()
  return NextResponse.json({ timestamp, signature })
}




