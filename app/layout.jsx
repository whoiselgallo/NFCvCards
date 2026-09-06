import './globals.css';
import brandConfig from '../brand.config';

export const metadata = {
  title: `${brandConfig.brandName} - ${brandConfig.brandTagline}`,
  description: brandConfig.brandDescription,
  icons: {
    icon: [
      { url: brandConfig.assets.favicon || '/favicon.png', type: 'image/png' },
      { url: brandConfig.assets.logo || '/logoTSPNGSQ.png', type: 'image/png' }
    ],
    shortcut: brandConfig.assets.favicon || '/favicon.png',
    apple: brandConfig.assets.appleIcon || '/apple-icon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href={brandConfig.assets.favicon || '/favicon.png'} />
        <link rel="apple-touch-icon" href={brandConfig.assets.appleIcon || '/apple-icon.png'} />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Plaster&family=Bruno+Ace&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
