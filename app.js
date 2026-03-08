const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Serve the form at "/"
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username">
                <button type="submit">Add</button>
            </form>
        `);
    } 
    
    // Handle POST request to "/message"
    else if (url === '/message' && method === 'POST') {
        const body = [];

        req.on('data', chunk => {
            body.push(chunk);  // collect data chunks
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];  // get the username

            console.log('Received username:', username); // log in terminal

            // Write username to a file
            fs.appendFile('users.txt', username + '\n', err => {
                if (err) {
                    console.error('Error writing to file', err);
                }

                // Redirect to "/" with 302
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });
        });
    } 
    
    // 404 for other routes
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server is running');
});