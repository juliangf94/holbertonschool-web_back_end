const http = require('http');
// The callback executes with every petition
// req: information about the petition (URL, method, headers)
const app = http.createServer((req, res) => {
  // res: object to build and send answer. 200 = ok
  res.statusCode = 200;
  // Indicate the body is plain text (no HTML or JSON)
  res.setHeader('Content-Type', 'text/plain');
  // ned() sends the body and close the connection
  res.end('Hello Holberton School!');
});

app.listen(1245, () => {
  console.log('Server running at http://localhost:1245/');
});

module.exports = app;
