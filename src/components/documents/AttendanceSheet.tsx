
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/components/StudentCard";
import { StudentInfoCard } from "@/components/documents/attendance/StudentInfoCard";
import { CourseAttendanceSummary } from "@/components/documents/attendance/CourseAttendanceSummary";
import { DailyAttendanceGrid } from "@/components/documents/attendance/DailyAttendanceGrid";
import { AttendancePolicy } from "@/components/documents/attendance/AttendancePolicy";
import { useAttendanceRecords } from "@/hooks/use-attendance-records";
import { generateAttendanceStats } from "@/utils/attendanceUtils";
import { CourseAttendance } from "@/types/attendance";
import { Loader2 } from "lucide-react";

interface AttendanceSheetProps {
  student: Student;
}

export function AttendanceSheet({ student }: AttendanceSheetProps) {
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([]);
  const { attendanceRecords, loading } = useAttendanceRecords({ studentId: student.id });
  
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      const stats = generateAttendanceStats(attendanceRecords);
      setCourseAttendance(stats);
    } else {
      // If no records, generate empty stats
      const emptyStats = generateAttendanceStats([]);
      setCourseAttendance(emptyStats);
    }
  }, [attendanceRecords]);

  // Calculate total stats for all courses
  const totalClasses = courseAttendance.reduce((sum, course) => sum + course.totalClasses, 0);
  const totalAttended = courseAttendance.reduce((sum, course) => sum + course.attended, 0);
  const overallPercentage = totalClasses > 0 
    ? ((totalAttended / totalClasses) * 100).toFixed(2) 
    : "0.00";

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Attendance Report</h2>
          
          <StudentInfoCard student={student} />
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CourseAttendanceSummary 
                courses={courseAttendance} 
                totalClasses={totalClasses}
                totalAttended={totalAttended}
                overallPercentage={overallPercentage}
              />

              <Separator />
              
              <DailyAttendanceGrid studentId={student.id} />
              
              <Separator />
              
              <AttendancePolicy />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
