import cloudinary from './config'

export async function getSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request({
    timestamp,
    upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  }, process.env.CLOUDINARY_API_SECRET!)
  return { timestamp, signature }
}




