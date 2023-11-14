
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import OutlineUserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import { useContext } from 'react';
import UserContext from './UserContext'


export default function Header(){
  const {user, login, logout} = useContext(UserContext)
    
  return (
    <header className="bg-gradient-to-r from-pink-200 to-pink-700 py-8 px-0">
    <nav className="container mx-auto flex items-center justify-between">
      <Link href="/" className="wt-title">WEB TECHNOLOGIES </Link>
      <ul className="space-x-10 flex ">
        <li>
          <Link href="/articles" className="wt-title">Articles</Link>
        </li>
        <li>
          <Link href="/about" className="wt-title">About us</Link>
        </li>
        <li>
          <Link href="/contacts" className="wt-title">Contact us</Link>
        </li>
        { user && (
          <li >
            <Link href="/profile" className="wt-title-2 flex" >
              <div>
              <OutlineUserCircleIcon width={20} height={20}/>
              {user.username}
              </div>
            </Link>
          </li>
        )}
        <li >
          { user ?
            <button onClick= {() => logout()} className="wt-title-2">
              Sign out
            </button>
            :
            <button onClick={() => login()} className="wt-title-2">
              Sign in
            </button>
          }
        </li>
        
        
      </ul>
    </nav>
  </header>
  )
 
}
