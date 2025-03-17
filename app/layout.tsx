import type { Metadata } from 'next';
import "@cloudscape-design/global-styles/index.css"
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'U of Silence',
  description: 'The Knowledge and Wisdom Exchange.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
