import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DASA UPSA',
    short_name: 'DASA',
    description: 'Department of Accounting Student Association - University of Professional Studies, Accra',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF8C61',
    icons: [
      {
        src: '/icons/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icons/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
      {
        src: '/icons/logo.jpg',
        sizes: 'any',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
  }
}
