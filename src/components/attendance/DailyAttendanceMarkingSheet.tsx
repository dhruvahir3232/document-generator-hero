
import { Student } from "@/components/StudentCard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardDescription 
} from "@/components/ui/card";
import { LoadingState } from "./marking/LoadingState";
import { EmptyStudentState } from "./marking/EmptyStudentState";
import { AttendanceTable } from "./marking/AttendanceTable";
import { useAttendanceData } from "./marking/useAttendanceData";

interface DailyAttendanceMarkingSheetProps {
  students: Student[];
  selectedDate: string;
  isLoading?: boolean;
}

export function DailyAttendanceMarkingSheet({ 
  students, 
  selectedDate, 
  isLoading = false 
}: DailyAttendanceMarkingSheetProps) {
  // Use the custom hook to manage attendance data
  const {
    attendanceRecords,
    savingStudentId,
    fetchingRecords,
    markAttendance
  } = useAttendanceData(selectedDate);

  if (isLoading) {
    return <LoadingState />;
  }

  if (students.length === 0) {
    return <EmptyStudentState />;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Daily Attendance</h2>
        <CardDescription>
          Mark attendance for all students for the selected date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fetchingRecords ? (
          <div className="flex justify-center py-6">
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading records...</span>
            </div>
          </div>
        ) : (
          <AttendanceTable
            students={students}
            attendanceRecords={attendanceRecords}
            savingStudentId={savingStudentId}
            onMarkAttendance={markAttendance}
          />
        )}
      </CardContent>
    </Card>
  );
}
