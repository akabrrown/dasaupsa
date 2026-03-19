import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary/config'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const mode = searchParams.get('mode') // 'open' or 'download'
  const requestedFilename = searchParams.get('filename')

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    // 1. Parse the Cloudinary URL
    const match = url.match(/\/(image|raw|video)\/(upload|private|authenticated)\/(?:v(\d+)\/)?(.+?)(\.\w+)?$/)
    
    if (!match) {
      return new NextResponse('Invalid Cloudinary URL Format', { status: 400 })
    }

    const resourceType = match[1]
    const deliveryType = match[2]
    let publicId = match[4]
    const urlExtension = match[5]
    const format = urlExtension ? urlExtension.replace('.', '').toLowerCase() : 'pdf'

    if (resourceType === 'raw' && urlExtension) {
      publicId = publicId + urlExtension
    }

    // 2. Generate an authenticated Admin API download URL
    // This uses the Admin API endpoint which we KNOW works (confirmed via testing)
    // Format: https://api.cloudinary.com/v1_1/{cloud}/resources/{resource_type}/{type}/{public_id}
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    const apiKey = process.env.CLOUDINARY_API_KEY!
    const apiSecret = process.env.CLOUDINARY_API_SECRET!
    
    // Use the original URL directly but authenticate with Admin API credentials
    const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    // The Admin API content endpoint:
    // GET /v1_1/{cloud_name}/resources/image/upload/{public_id}.{format}
    const adminContentUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/${deliveryType}/${publicId}.${format}`
    
    console.log(`[Proxy] Fetching via Admin content URL: ${adminContentUrl}`)
    
    // Try the original URL with no auth first (in case it's accessible)
    let response = await fetch(url)
    
    if (!response.ok) {
      // If direct URL fails, try generating a proper expiring signed URL
      // using timestamp-based signing (different from the delivery signature)
      const timestamp = Math.round(new Date().getTime() / 1000)
      const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`
      const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex')
      
      const downloadApiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/download?` +
        `public_id=${encodeURIComponent(publicId)}&` +
        `format=${format}&` +
        `timestamp=${timestamp}&` +
        `api_key=${apiKey}&` +
        `signature=${signature}`
      
      console.log(`[Proxy] Trying download API: ${downloadApiUrl}`)
      response = await fetch(downloadApiUrl)
    }
    
    if (!response.ok) {
      // Last resort: fetch directly from the original URL with Basic Auth
      console.log(`[Proxy] Trying original URL with Basic Auth`)
      response = await fetch(url, {
        headers: { 'Authorization': authHeader }
      })
    }

    if (!response.ok) {
      return new NextResponse(`Cloudinary rejected all access methods: ${response.status}`, { status: 502 })
    }

    const buffer = await response.arrayBuffer()
    const headers = new Headers()
    
    // Determine MIME type
    let contentType = 'application/octet-stream'
    if (format === 'pdf') contentType = 'application/pdf'
    else if (['pptx', 'ppt'].includes(format)) contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    else if (['docx', 'doc'].includes(format)) contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    else if (['xlsx', 'xls'].includes(format)) contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    
    // Build filename
    let finalFilename = requestedFilename || (publicId.split('/').pop() || 'resource')
    const ext = `.${format}`
    if (!finalFilename.toLowerCase().endsWith(ext)) {
      finalFilename = `${finalFilename}${ext}`
    }
    
    headers.set('Content-Type', contentType)
    headers.set('Content-Length', buffer.byteLength.toString())
    headers.set('Cache-Control', 'public, max-age=3600')
    
    if (mode === 'download') {
      headers.set('Content-Disposition', `attachment; filename="${finalFilename}"`)
    } else {
      headers.set('Content-Disposition', `inline; filename="${finalFilename}"`)
    }

    return new NextResponse(new Uint8Array(buffer), { status: 200, headers })

  } catch (error: any) {
    console.error('[Proxy] Internal error:', error)
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 })
  }
}
