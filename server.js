const http = require('http')
const url = require('url');
const fs = require('fs');
const port = process.argv[2] || 8888
const server = http.createServer((request, response) => {
    const { url: pathWithQuery } = request;
    const baseUrl = `http://${request.headers.host}/`
    const urlObj = new url.URL(pathWithQuery, baseUrl);
    const { search, searchParams, pathname } = urlObj;
    console.log(urlObj)
    response.statusCode = 200;

    const filePath = pathname === '/' ? '/index.html' : pathname;
    const index = filePath.lastIndexOf('.')
    const suffix = filePath.substring(index)

    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpeg': 'image/jpeg',
    }
    response.setHeader('Content-Type', `${contentTypes[suffix] || 'text/html'};charset=utf-8`)
    let content;
    try {
        content = fs.readFileSync(`./public${filePath}`)
    } catch (e) {
        console.error(e)
        response.statusCode = 404;
    }
    response.write(content)
    response.end()
})
server.listen(port, 'localhost', () => {
    console.log('服务器运行在http://localhost:' + port)
} )
