import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Học Qua Sách — Tóm tắt sách hay mỗi ngày',
  description: 'Học kiến thức từ hàng nghìn cuốn sách chỉ trong 15 phút.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
