import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Aprender Números',
  description: 'Juego educativo para niños de 6 a 10 años. ¡Divertido y fácil de usar!',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aprender Números',
  },
  openGraph: {
    title: 'Aprender Números',
    description: '¡Aprende matemáticas jugando!',
    type: 'website',
    images: ['https://picsum.photos/seed/mathgame/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-body antialiased bg-kid-warm text-slate-800">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
