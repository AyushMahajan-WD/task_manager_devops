import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto max-w-5xl p-4 flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-500 py-4">
        PERN Task Manager
      </footer>
    </div>
  );
}
