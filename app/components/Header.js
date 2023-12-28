import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useContext } from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { useUser } from './UserContext';
import { MoonIcon } from '@heroicons/react/outline';
import { SunIcon } from '@heroicons/react/solid';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';




export default function Header() {
  const { user, Hlogout } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Vous pouvez également stocker le choix de l'utilisateur dans un cookie/localStorage
  };
 
  return (
    <header className="bg-gradient-to-r from-orange-200 to-orange-500 py-8 px-0">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="wt-title">
          WEB'TRIPS
        </Link>
        <ul className="space-x-10 flex">
          <li>
            <Link href="/travels" className="wt-title">
              Posts
            </Link>
          </li>
          <li>
            <Link href="/about" className="wt-title">
              About us
            </Link>
          </li>
          <li>
            <Link href="/contacts" className="wt-title">
              Contact us
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/admin/profile" className="wt-title flex">
                <div className='flex itemps-center'>
                  <OutlineUserCircleIcon width={30} height={30}/>
                  <span className="ml-2">{user.email}</span>                  
                </div>
              </Link>
            </li>
            )
            }<li>
            {user ? (
                    <button onClick={Hlogout} className="wt-title">
                          Sign Out
                    </button>
                ):(
                  <Link href="/login"className="wt-title">
                  Sign In
                </Link>)}

                  
          </li>
     
        </ul>
      </nav>
    </header>
  );
}

