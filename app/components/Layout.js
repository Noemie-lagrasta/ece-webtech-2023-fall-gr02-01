import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { useUser } from './UserContext.js';

export default function Layout({ children }) {
  const { darkMode } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${darkMode ? 'dark' : 'light'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
