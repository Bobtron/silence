import type { Metadata } from 'next';
import "@cloudscape-design/global-styles/index.css"

export const metadata: Metadata = {
  title: 'The College of Silence',
  description: 'The Knowledge and Wisdom Exchange.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
