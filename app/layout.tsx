import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IdeaVault AI',
  description: '10,000+ AI-Validated Business Ideas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
