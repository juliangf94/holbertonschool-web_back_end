const http = require('http');
const fs = require('fs');

function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }
      const emptyLines = data.split('\n').filter((line) => line.trim() !== '');
      const students = emptyLines.slice(1);
      // We build the output as a acumulated string
      let output = `Number of students: ${students.length}\n`;

      const fields = {};
      students.forEach((student) => {
        const parts = student.split(',');
        const field = parts[3];
        const firstname = parts[0];
        if (!fields[field]) fields[field] = [];
        fields[field].push(firstname);
      });

      Object.keys(fields).forEach((field) => {
        output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
      });
      // Resolves with the completed string, ready to send
      resolve(output);
    });
  });
}

const app = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.end('Hello Holberton School!\n');
  } else if (req.url === '/students') {
    // process.argv[2] is the path to csv passed as argument: node 5-http.js database.csv
    countStudents(process.argv[2])
      .then((data) => {
        // res.end() can only be called once
        res.end(`This is the list of our students\n${data}`);
      })
      .catch((err) => {
        res.end(`This is the list of our students\n${err.message}\n`);
      });
  }
});

app.listen(1245, () => {
  console.log('Server running at http://localhost:1245/');
});

module.exports = app;
