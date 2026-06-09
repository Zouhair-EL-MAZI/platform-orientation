import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const StudentSidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside className="w-56 bg-white border-r p-4">
      <div className="text-lg font-semibold mb-4">{t('sidebar.student')}</div>
      <nav className="flex flex-col space-y-2 text-sm">
        <NavLink to="/dashboard" className={({isActive})=>isActive? 'font-semibold':'opacity-90'}>{t('sidebar.dashboard')}</NavLink>
        <NavLink to="/courses" className={({isActive})=>isActive? 'font-semibold':'opacity-90'}>{t('sidebar.courses')}</NavLink>
        <NavLink to="/profile" className={({isActive})=>isActive? 'font-semibold':'opacity-90'}>{t('sidebar.profile')}</NavLink>
      </nav>
    </aside>
  );
};

export default StudentSidebar;
