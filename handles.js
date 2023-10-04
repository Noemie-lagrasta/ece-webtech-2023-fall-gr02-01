module.exports = {
    serverHandle : function (req, res) {
        const url = require('url')
        const qs = require('querystring')
        const route = url.parse(req.url)
        const path = route.pathname 
        const params = qs.parse(route.query)

        if (path === '/') {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write('<h1 style="font-size: 24px;">Welcome to the Application!<h1>')
            res.write('<p style="font-size: 18px;">The application displays the first name present in the URL. Simply enter your first name in the URL after "name" and see what happens!</p>')
            res.write('<p style="font-size: 18px;"><a href="/hello">Go to /hello?name=</a></p>')
            res.end()
        } else if (path === '/hello') {
            res.writeHead(200, {'Content-Type': 'text/html'})

            if ('name' in params) {
                const name = params['name']
                if (name === 'Noemie') {
                    res.write('<h1 style="font-size: 24px;">Hello!</h1><p style="font-size: 18px;">We are Noemie, Ariane and Inchirah and we are the engineer students who create this application.</p>')
                } else {
                    res.write('<h1 style="font-size: 24px;">Hello ' + name + '</h1>')
                } 
            } else {
                res.write('<h1 style="font-size: 24px;">Hello anonymous</h1>')
            }
        } else if (path === '/about') {
            const fs = require('fs')
            const filePath = __dirname + '/content/about.json'

            if (fs.existsSync(filePath)) {
                const about = require(filePath)

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(about))
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.write('<h1 style="font-size: 24px;">404 - Not Found</h1>')
            }
            
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.write('<h1 style="font-size: 24px;">404 - Not Found</h1>')
        }

        res.end()
    }
}