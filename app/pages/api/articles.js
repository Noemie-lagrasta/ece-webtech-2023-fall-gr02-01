export const db = [{
  id: '6ec0bd7f-11c0-43da-975e-lkfsdds',
  title: 'My article 1',
  content: 'Content of the article 1.',
  date: '04/10/2022',
  author: 'Liz Gringer'
},


{
  id: '6ec0bd7f-11c0-43da-975e-fhthzsjbzb',
  title: 'My article 2',
  content: 'Content of the article 2.',
  date: '07/10/2022',
  author: 'Noemie Lagrasta'
},


{
  id: '6ec0bd7f-11c0-43da-975e-aqdsfre',
  title: 'My article 3',
  content: 'Content of the article 3.',
  date: '04/11/2022',
  author: 'Ariane Aubrun'
}]

export default function handler(req, res) {
  res.status(200).json(db)
}