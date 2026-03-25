import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import GNB from '@/components/common/GNB';
import Footer from '@/components/common/Footer';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sync-Up | 해커톤 성장 플랫폼',
  description: '해커톤, 단순한 참여를 넘어 당신의 성장이 기록되는 곳',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <GNB />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
