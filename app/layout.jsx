import './globals.css';

export const metadata = {
  title: 'TSOLUTIONS IPIDD - vCard Engine & Identidad Digital',
  description: 'Generador de Identidad Digital Interactiva, NFC & vCard por TSOLUTIONS IPIDD',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logoTSPNGSQ.png', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/apple-icon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
