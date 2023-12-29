import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

export default function Header() {
  const { user, Hlogout, darkMode, toggleDarkMode } = useUser();

  return (
    <header className={`py-8 px-0 ${darkMode ? 'dark-header' : 'light-header'}`}>
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className={`text-2xl font-bold text-center hover:underline`}>
          WEB&apos;TRIPS
        </Link>
        <ul className="space-x-10 flex">
          <li>
            <Link href="/travels" className={`text-2xl font-bold text-center hover:underline`}>
              Posts
            </Link>
          </li>
          <li>
            <Link href="/maps" className={`text-2xl font-bold text-center hover:underline `}>
              Maps
            </Link>
          </li>
          <li>
            <Link href="/about" className={`text-2xl font-bold text-center hover:underline`}>
              About us
            </Link>
          </li>
          <li>
            <Link href="/contacts" className={`text-2xl font-bold text-center hover:underline`}>
              Contact us
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/admin/profile" className={`text-2xl font-bold text-center flex hover:underline`}>
                <div className='flex items-center'>
                  <OutlineUserCircleIcon width={30} height={30} />
                  <span className="ml-2 ">{user.email}</span>
                </div>
              </Link>
            </li>
          )}
          <li>
            {user ? (
              <button onClick={Hlogout} className={`text-2xl font-bold text-center hover:underline`}>
                Sign Out
              </button>
            ) : (
              <Link href="/login" className={`text-2xl font-bold text-center hover:underline`}>
                Sign In
              </Link>
            )}
          </li>
          <li>
            {darkMode ?
            (
              <button onClick={toggleDarkMode} className={`flex text-xl font-bold text-center hover:underline`}>
                <SunIcon className="h-9 w-9" aria-hidden="true" />
             go to light mode
             
            </button>

            ):( <button onClick={toggleDarkMode} className={`flex text-xl font-bold text-center hover:underline`}>
              <MoonIcon className="h-9 w-9" aria-hidden="true" />
            go to dark mode
          </button>)}
           
          </li>
        </ul>
      </nav>
    </header>
  );
}
