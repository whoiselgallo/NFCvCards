import './globals.css';

export const metadata = {
  title: 'vCard Builder - tsolutions ipidd',
  description: 'VCard Engine by TSolutions IPIDD',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Inter:wght@400;500&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
