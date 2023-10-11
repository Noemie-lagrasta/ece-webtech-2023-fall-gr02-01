import React from 'react'
import { useRouter } from 'next/router'
import { articles } from '../../../database'

const Article = () => {
  const router = useRouter()
  const { articleId } = router.query

  const article = articles.find(article => article.id === parseInt(articleId))

  return (
    <div>
      {article ? (
      <div>
        <p>Article ID: {articleId}</p>
        <h1>{article.title}</h1>
        <h2>{article.content}</h2>
        </div>
      ) : (
        <p>Article not found</p>
      )} 
    </div>
  )
}

export default Article;
