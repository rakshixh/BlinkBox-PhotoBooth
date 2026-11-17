import './globals.scss';
import { boothCopy } from '@/data/data';

export const metadata = {
  title: boothCopy.metadataTitle,
  description: boothCopy.metadataDescription,
  applicationName: 'BlinkBox Photo Booth',
  appleWebApp: { capable: true, title: 'BlinkBox', statusBarStyle: 'default' },
  icons: { icon: '/icon-192.svg', apple: '/icon-192.svg' },
};

export const viewport = {
  themeColor: '#f4f0e8',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
