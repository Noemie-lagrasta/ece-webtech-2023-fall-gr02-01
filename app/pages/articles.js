import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout.js';
import { db } from './api/articles';

export async function getStaticProps() {
  const response = await fetch("http://localhost:3000/api/articles");
  const articles = await response.json();

  return{
      props: {
          articles
      }
  }
}


export default function Articles({articles}) {


  return (
    <Layout>
      <Head>
        <title>WebTech - articles</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wt-center">
      <div className="wt-welcome">
        ARTICLES
      </div>
      </main>
      <br/><br/>
      <p className='wt-texte'>Click on the article title, to see more details</p>
      <br/><br/>
      <div className="flex justify-center">
        <table className="table">
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="wt-articles">
                  <Link href={`/articles/${article.id}`}>{article.title}</Link>
                </td>
                <td className="wt-content">{article.content}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}