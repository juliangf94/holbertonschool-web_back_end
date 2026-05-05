export default function updateStudentGradeByCity(students, city, newGrades) {
  return students
    .filter((s) => s.location === city)
    .map((s) => {
      const gradeObj = newGrades.find((g) => g.studentId === s.id);
      return { ...s, grade: gradeObj ? gradeObj.grade : 'N/A' };
    });
}
