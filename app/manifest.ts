import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aprender Números',
    short_name: 'AprenderNúm',
    description: 'Juego educativo para aprender a comparar y ordenar números',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F3F0',
    theme_color: '#F5A83D',
    icons: [
      {
        src: 'https://picsum.photos/seed/appicon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/appicon/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
