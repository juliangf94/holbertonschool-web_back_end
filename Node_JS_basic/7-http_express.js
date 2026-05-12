const express = require('express');
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
      resolve(output);
    });
  });
}

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (req, res) => {
  countStudents(process.argv[2])
    .then((data) => {
      // res.type('txt') stablish Content-Type: text/plain before sending
      res.type('txt').send(`This is the list of our students\n${data}`);
    })
    .catch((err) => {
      res.type('txt').send(`This is the list of our students\n${err.message}\n`);
    });
});

app.listen(1245);

module.exports = app;
