import type { Metadata } from 'next';
import "@cloudscape-design/global-styles/index.css"
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Illy Revolution!',
  description: 'All revolutions are impossible until they become inevitable.',
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
