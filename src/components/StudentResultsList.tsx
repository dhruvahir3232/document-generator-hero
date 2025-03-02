
import { Student, StudentCard } from "./StudentCard";

interface StudentResultsListProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
}

export function StudentResultsList({ 
  students, 
  selectedStudent, 
  onSelectStudent 
}: StudentResultsListProps) {
  if (students.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <h2 className="text-xl font-semibold">Search Results</h2>
      <div className="space-y-3">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onSelect={onSelectStudent}
            selected={selectedStudent?.id === student.id}
          />
        ))}
      </div>
    </div>
  );
}
