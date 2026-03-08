const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Home page 
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');

        // Read all messages from file
        let messages = [];
        if (fs.existsSync('message.txt')) {
            const data = fs.readFileSync('message.txt', 'utf-8');
            messages = data.split('\n').filter(line => line.trim() !== '');
            messages.reverse(); // latest message on top
        }

        // Display messages and form
        res.end(`
            <h2>Messages:</h2>
            <ul>
                ${messages.map(msg => `<li>${msg}</li>`).join('')}
            </ul>
            <form action="/message" method="POST">
                <label>Message:</label>
                <input type="text" name="message">
                <button type="submit">Add</button>
            </form>
        `);
    }

    // Handle form submission
    else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const parsed = Buffer.concat(body).toString();
            const message = parsed.split('=')[1]; // get message value
            console.log('Received message:', message);

            // Prepend new message to file
            let existing = '';
            if (fs.existsSync('message.txt')) {
                existing = fs.readFileSync('message.txt', 'utf-8');
            }
            fs.writeFileSync('message.txt', message + '\n' + existing);

            // Redirect back to home page
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        });
    }

    // 404 for other routes
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});