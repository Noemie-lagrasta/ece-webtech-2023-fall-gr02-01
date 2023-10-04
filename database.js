const db = {

    articles: [

        {
            id: '6ec0bd7f-11c0-43da-975e-lkfsdds',
            title: 'My article',
            content: 'Content of the article.',
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
        },



    ],

    comments: [

        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            timestamp: 1664835049,
            content: 'Content of the comment.',
            articleId: '6ec0bd7f-11c0-43da-975e-lkfsdds',
            author: 'Bob McLaren'
        }, 
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-zjbiuzhizef',
            timestamp: 16644567,
            content: 'Content of the comment 2.',
            articleId: '6ec0bd7f-11c0-43da-975e-fhthzsjbzb',
            author: 'Granny'
        }, 
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-qwxdepol',
            timestamp: 166234590,
            content: 'Content of the comment 3.',
            articleId: '6ec0bd7f-11c0-43da-975e-aqdsfre',
            author: 'Mamacita'
        },

    ]

}

module.exports = db;


