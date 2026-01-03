import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/db/supabase-server';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/fr/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/fr');
  }

  const adminData = {
    email: user.email || '',
    name: profile.full_name || user.email?.split('@')[0] || 'Admin',
    role: profile.role,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader admin={adminData} />
        <main className="p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
