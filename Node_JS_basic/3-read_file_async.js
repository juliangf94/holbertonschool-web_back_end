const fs = require('fs');

function countStudents(path) {
  // With new Promise we can use .then()/.catch()
  return new Promise((resolve, reject) => {
    // Node executes the rest of the script while reading. It doesn´t block it
    fs.readFile(path, 'utf8', (err, data) => {
      // Callback for when Node finish reading or fails
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }
      const emptyLines = data.split('\n').filter((line) => line.trim() !== '');
      const students = emptyLines.slice(1);
      let output = `Number of students: ${students.length}\n`;
      console.log(`Number of students: ${students.length}`);

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
        console.log(`Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`);
      });

      resolve(output);
    });
  });
}

module.exports = countStudents;
