import React from 'react';
import StudentSidebar from '@/components/StudentSidebar';

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default StudentLayout;
