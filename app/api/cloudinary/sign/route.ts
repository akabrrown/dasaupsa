import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary/config'

export async function POST(request: NextRequest) {
  try {
    const { publicId, asAttachment, resourceType } = await request.json()
    
    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 })
    }

    const expiresAt = Math.round(Date.now() / 1000) + 3600

    // Use 'upload' type as confirmed by resource metadata
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType || 'image',
      type: 'upload',
      sign_url: true,
      expires_at: expiresAt,
      ...(asAttachment ? { flags: 'attachment' } : {}),
    })

    return NextResponse.json({ url: signedUrl })
  } catch (error: any) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
  }
}
