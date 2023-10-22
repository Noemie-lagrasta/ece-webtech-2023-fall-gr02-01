
import Link from 'next/link'
import Image from 'next/image'

export default function Header(){
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
      </ul>
    </nav>
  </header>
  )
 
}
