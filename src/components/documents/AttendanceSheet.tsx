
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "../StudentCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AttendanceRecord } from "@/types/attendance";
import { CourseAttendanceSummary } from "./attendance/CourseAttendanceSummary";
import { DailyAttendanceGrid } from "./attendance/DailyAttendanceGrid";
import { StudentInfoCard } from "./attendance/StudentInfoCard";
import { AttendancePolicy } from "./attendance/AttendancePolicy";
import { generateAttendanceStats, generateDailyAttendance } from "@/utils/attendanceUtils";

interface AttendanceSheetProps {
  student: Student;
}

export function AttendanceSheet({ student }: AttendanceSheetProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [courses, setCourses] = useState(generateAttendanceStats([]));
  const [dailyAttendance, setDailyAttendance] = useState(generateDailyAttendance([]));
  
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  useEffect(() => {
    if (student?.id) {
      fetchAttendanceData();
    }
  }, [student]);
  
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Fetch attendance records for this student
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', student.id)
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAttendanceData(data as AttendanceRecord[]);
        
        // Process the data for display
        setCourses(generateAttendanceStats(data as AttendanceRecord[]));
        setDailyAttendance(generateDailyAttendance(data as AttendanceRecord[]));
      }
    } catch (error: any) {
      console.error("Error fetching attendance data:", error);
      toast({
        title: "Error",
        description: "Could not fetch attendance records.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate overall attendance
  const totalClasses = courses.reduce((sum, course) => sum + course.totalClasses, 0);
  const totalAttended = courses.reduce((sum, course) => sum + course.attended, 0);
  const overallPercentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : "0.00";

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Student Attendance Record</CardTitle>
                <p className="opacity-90">{currentMonth}</p>
              </div>
              <div className="text-right">
                <p>University of Excellence</p>
                <p className="text-sm opacity-80">Academic Affairs Department</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading attendance data...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Student Information */}
                <StudentInfoCard student={student} />
                
                {/* Course-wise Attendance Summary */}
                <CourseAttendanceSummary 
                  courses={courses} 
                  totalClasses={totalClasses} 
                  totalAttended={totalAttended} 
                  overallPercentage={overallPercentage} 
                />
                
                {/* Daily Attendance */}
                <DailyAttendanceGrid dailyAttendance={dailyAttendance} />
                
                {/* Attendance Policy */}
                <AttendancePolicy />
                
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <p>This is a computer-generated attendance record and does not require a signature.</p>
                  <p>For any discrepancies in attendance records, please contact the respective course instructor.</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
