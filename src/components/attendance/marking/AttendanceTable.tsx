
import { Student } from "@/components/StudentCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AttendanceRecord } from "@/types/attendance";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { AttendanceActionButtons } from "./AttendanceActionButtons";

interface AttendanceTableProps {
  students: Student[];
  attendanceRecords: Record<string, AttendanceRecord>;
  savingStudentId: string | null;
  onMarkAttendance: (studentId: string, status: "present" | "absent" | "late" | "excused") => void;
}

export function AttendanceTable({ 
  students, 
  attendanceRecords, 
  savingStudentId, 
  onMarkAttendance 
}: AttendanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => {
          const record = attendanceRecords[student.id];
          const status = record?.status || null;
          
          return (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.class || "-"}</TableCell>
              <TableCell>
                {status ? (
                  <AttendanceStatusBadge status={status} />
                ) : (
                  <span className="text-muted-foreground">Not marked</span>
                )}
              </TableCell>
              <TableCell>
                <AttendanceActionButtons
                  studentId={student.id}
                  currentStatus={status}
                  isSaving={savingStudentId === student.id}
                  onMarkAttendance={onMarkAttendance}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
