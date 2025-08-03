import React from 'react';
import { NotificationBell } from './NotificationBell';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-end px-4">
      <NotificationBell />
    </header>
  );
};