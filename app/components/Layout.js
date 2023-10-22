
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'



export default function Layout({children}){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-20 py-10 bg-white" >
        {children}
      </main>
      <Footer />
    </div>
  )
}
