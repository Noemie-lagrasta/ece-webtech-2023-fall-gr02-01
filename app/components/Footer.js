import React from 'react';
import Link from 'next/link';
import { useUser } from './UserContext';

export default function Footer() {
  const { darkMode } = useUser();

  return (
    <footer className={`py-8 px-0 ${darkMode ? 'dark-footer' : 'light-footer'}`}>
      <div>
        <Link href="/about" className={`wt-title flex items-center justify-center`}>
          Powered by Ariane Aubrun and Noemie Lagrasta
        </Link>
      </div>
    </footer>
  );
}
