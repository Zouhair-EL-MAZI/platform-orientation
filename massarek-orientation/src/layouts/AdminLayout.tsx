// import React from 'react';
// import AdminSidebar from '@/components/AdminSidebar';

// const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <AdminSidebar />
//       <main className="flex-1 p-6 overflow-auto">{children}</main>
//     </div>
//   );
// };

// export default AdminLayout;
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
