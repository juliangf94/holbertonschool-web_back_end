const fs = require('fs');

function countStudents(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    // split('\n') divides the string in an array of lines
    // filter() deletes empty lines
    const emptyLines = data.split('\n').filter((line) => line.trim() !== '');
    // The first line is firstname,lastname,age,field, we eliminat it with slice(1)
    const students = emptyLines.slice(1);

    console.log(`Number of students: ${students.length}`);
    // Build the object
    const fields = {};
    students.forEach((student) => {
      // Johann,Kerbrou,30,CS
      const parts = student.split(',');
      // Take the field
      const field = parts[3];
      // Take the first name
      const firstname = parts[0];
      if (!fields[field]) fields[field] = [];
      fields[field].push(firstname);
    });

    // Iterate over each field and print the count and name´s list
    Object.keys(fields).forEach((field) => {
      console.log(`Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`);
    });
  } catch (e) {
    throw new Error('Cannot load the database');
  }
}

module.exports = countStudents;
