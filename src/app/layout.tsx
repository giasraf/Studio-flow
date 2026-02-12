import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Flow',
  description: 'Music Production Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
