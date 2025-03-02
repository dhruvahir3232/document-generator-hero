
import { Student } from "@/components/StudentCard";

interface StudentInfoCardProps {
  student: Student;
}

export function StudentInfoCard({ student }: StudentInfoCardProps) {
  return (
    <div className="mb-6 p-4 bg-secondary/40 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-muted-foreground">STUDENT NAME</h3>
          <p className="font-medium">{student.name}</p>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">STUDENT ID</h3>
          <p className="font-medium">{student.id}</p>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">PROGRAM</h3>
          <p className="font-medium">{student.class || "Not specified"}</p>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">SEMESTER</h3>
          <p className="font-medium">Fall 2023</p>
        </div>
      </div>
    </div>
  );
}
