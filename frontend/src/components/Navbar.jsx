import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <img src="/assets/logo.png" alt="Logo" className="h-8 w-8 rounded" />
        <h1 className="text-lg font-semibold flex-1">PERN Task Manager</h1>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/projects" className={({isActive}) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}>Projects</NavLink>
          <NavLink to="/tasks" className={({isActive}) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}>Tasks</NavLink>
        </nav>
      </div>
      <img src="/assets/banner.jpg" alt="Banner" className="w-full h-32 object-cover" />
    </header>
  );
}
