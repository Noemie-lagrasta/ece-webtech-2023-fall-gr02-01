import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout.js'

export default function Page() {
  return (
    <Layout>
    <main className="wt-center">
      <div className="wt-welcome">
        WELCOME <br/> TO OUR <br/>WEBSITE
      </div>
    </main>
  </Layout>
  )
}
