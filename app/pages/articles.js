import React from 'react'
import Header from 'components/header'
import { articles } from '../../database'

const Articles = ({ articles }) => {
    return (
      <div>
        <Header />
        <main>
          <h1>Articles</h1>
          <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <h2>{article.title}</h2>
                <p>{article.content}</p>
              </li>
            ))}
          </ul>
        </main>
      </div>
    )
  }

export default Articles

export async function getStaticProps() {
    return {
      props: {
        articles,
      },
    }
  }
