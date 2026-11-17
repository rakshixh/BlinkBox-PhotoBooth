import './globals.scss';
import { boothCopy } from '@/data/data';

export const metadata = {
  title: boothCopy.metadataTitle,
  description: boothCopy.metadataDescription,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
