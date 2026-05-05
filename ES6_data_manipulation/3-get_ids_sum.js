export default function getStudentIdsSum(students) {
  return students.reduce((acc, s) => acc + s.id, 0);
}
