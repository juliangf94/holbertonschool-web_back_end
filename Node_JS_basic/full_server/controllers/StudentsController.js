import readDatabase from '../utils';

export default class StudentsController {
  static getAllStudents(req, res) {
    readDatabase(process.argv[2])
      .then((fields) => {
        const keys = Object.keys(fields);
        const sorted = keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        let output = 'This is the list of our students\n';
        sorted.forEach((field) => {
          output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
        });

        res.status(200).send(output);
      })
      .catch(() => res.status(500).send('Cannot load the database'));
  }

  static getAllStudentsByMajor(req, res) {
    const { major } = req.params;

    if (major !== 'CS' && major !== 'SWE') {
      res.status(500).send('Major parameter must be CS or SWE');
      return;
    }

    readDatabase(process.argv[2])
      .then((fields) => {
        const students = fields[major] || [];
        res.status(200).send(`List: ${students.join(', ')}`);
      })
      .catch(() => res.status(500).send('Cannot load the database'));
  }
}
