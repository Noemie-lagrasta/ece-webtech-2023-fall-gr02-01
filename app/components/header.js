import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contacts">Contacts</Link></li>
          <li><Link href="/articles">Articles</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
