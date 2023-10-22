import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { db } from '../api/articles';

export default function Article() {
  const router = useRouter();
  const { id } = router.query;
  const article = db.find((a) => a.id === id);

  // Vous devrez récupérer les détails de l'article à partir de votre source de données (par exemple, votre API).
  // Pour cet exemple, nous utilisons une base de données fictive.
  // Assurez-vous de personnaliser cette partie en fonction de votre source de données réelle.


  return (
    <Layout>
      <main className="wt-center">
        <div className="wt-welcome">

          {article.title}</div>

      </main>
      <br /><br />
      <div className="wt-texte">{article.content}<br/>Author: {article.author}<br/> Date: {article.date}</div>


    </Layout >
  );
}
/*
<p className="wt-content">{article.content}</p>
<p className="wt-content">Author: {article.author}</p>
<p className="wt-content">Date: {article.date}</p>
*/