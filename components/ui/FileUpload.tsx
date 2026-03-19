import { useState } from 'react'
import { Spinner } from './Spinner'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function FileUpload({ 
  onUpload, 
  value, 
  folder = 'general',
  accept = "image/*",
  allowedTypesLabel = "PNG, JPG or WebP (Max. 5MB)"
}: { 
  onUpload: (url: string) => void, 
  value?: string,
  folder?: string,
  accept?: string,
  allowedTypesLabel?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (rest of function remains same, except for Cloudinary auto upload)
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Max 5MB allowed.')
      setUploading(false)
      return
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary configuration missing (.env.local)')
      setUploading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', `DASA/${folder}`)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Cloudinary Error:', errorData)
        throw new Error(errorData.error?.message || 'Upload failed')
      }

      const data = await response.json()
      onUpload(data.secure_url)
    } catch (err: any) {
      setError(err.message || 'Error uploading file.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full aspect-video md:aspect-video bg-gray-50 rounded-2xl overflow-hidden group border border-gray-100">
          {isImage(value) ? (
            <img src={value} alt="Uploaded file" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/50 p-6 text-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-3">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <p className="text-sm font-bold text-DASA-black truncate max-w-[200px]">File Uploaded Successfully</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Ready for submission</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => onUpload('')}
              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <label className={`
          flex flex-col items-center justify-center w-full min-h-[160px] 
          border-2 border-dashed rounded-[32px] transition-all cursor-pointer
          ${uploading ? 'bg-gray-50 border-blue-200' : 'bg-white border-gray-200 hover:border-DASA-orange hover:bg-blue-50/30'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Spinner />
                <p className="mt-4 text-sm font-bold text-DASA-black animate-pulse">Uploading to Cloudinary...</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-blue-50 text-DASA-black rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <p className="mb-2 text-sm text-gray-700 font-bold">
                  Click to upload <span className="text-DASA-orange">or drag and drop</span>
                </p>
                <p className="text-xs text-gray-400 font-medium">{allowedTypesLabel}</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={uploading} 
            accept={accept}
          />
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold ring-1 ring-red-100">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  )
}




