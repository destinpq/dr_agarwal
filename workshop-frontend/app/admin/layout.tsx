import '../globals.css';
import AntdProvider from '../providers';

export const metadata = {
  title: 'Admin Dashboard - Dr. Agarwal Workshop',
  description: 'Admin dashboard for Dr. Agarwal Workshop registrations',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdProvider>
      <div>{children}</div>
    </AntdProvider>
  );
} 