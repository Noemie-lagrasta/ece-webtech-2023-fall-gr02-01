const url = require('url')
const qs = require('querystring')

module.exports = {
    serverHandle: function (req, res) {
        const route = url.parse(req.url)
        const path = route.pathname 
        const params = qs.parse(route.query)
      
        res.writeHead(200, {'Content-Type': 'text/plain'})
      
        if (path === '/')
        {
            res.write('The  path works as folllows: \n\n' +'- If you type "/hello?name=" followed by a random name, you will get a reply "Hello + [name entered]"\n' 
            + '- If you type "/hello?name=Inchirah", you will get a short intro of myself \n' + "- If you type any other path, a 404 code with a not found message will appear ")

        }
        else if (path === '/hello' && 'name' in params && params['name'] != 'Inchirah') {
          res.write('Hello ' + params['name'])
        } 
        else if (path === '/hello' && params['name'] == 'Inchirah')
        {
            res.write('Hello! I am Inchirah Jabir and I am a student at ECE Paris.')
        }
        else if (path === '/about')
        {
            const about = require("about");
            about.readFile("./about.json", (err, jsonString) => {
            if (err) 
            {
                res.write('404\n' + 'Not found')
            }
            try {
                console.log(jsonString);
            } 
            catch (err) {
            console.log("Error parsing JSON string:", err);
            });
        }
        else {
          res.write('404\n' + 'Not found')
        }
        
        res.end()
      }
  }
