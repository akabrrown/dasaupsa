import { useState } from 'react'
import { getSignature } from '@/lib/cloudinary/upload'

export function useUpload() {
  const [progress, setProgress] = useState(0)

  const upload = async (file: File) => {
    setProgress(10)
    const { timestamp, signature } = await getSignature()
    setProgress(30)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(30 + (e.loaded / e.total) * 70)
      }
    }

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          setProgress(100)
          resolve(data.secure_url)
        } else {
          reject(new Error('Upload failed'))
        }
      }
      xhr.onerror = () => reject(new Error('Upload failed'))
      xhr.send(formData)
    })
  }

  return { upload, progress }
}




