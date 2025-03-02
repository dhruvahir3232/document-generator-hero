
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "../StudentCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AttendanceSheetProps {
  student: Student;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function AttendanceSheet({ student }: AttendanceSheetProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [courses, setCourses] = useState<{
    id: string;
    name: string;
    totalClasses: number;
    attended: number;
    percentage: number;
  }[]>([]);
  const [dailyAttendance, setDailyAttendance] = useState<{
    day: number;
    date: string;
    status: string;
    isWeekend: boolean;
  }[]>([]);
  
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
        generateAttendanceStats(data as AttendanceRecord[]);
        generateDailyAttendance(data as AttendanceRecord[]);
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
  
  const generateAttendanceStats = (records: AttendanceRecord[]) => {
    // For this example, we'll just use the mock courses but in a real application
    // you would process the actual data to get course-specific attendance
    const mockCourses = [
      { 
        id: "CS101",
        name: "Introduction to Computer Science",
        totalClasses: 24,
        attended: 0,
        percentage: 0
      },
      { 
        id: "CS201",
        name: "Data Structures and Algorithms",
        totalClasses: 24,
        attended: 0,
        percentage: 0
      },
      { 
        id: "MATH101",
        name: "Calculus I",
        totalClasses: 32,
        attended: 0,
        percentage: 0
      },
      { 
        id: "ENG201",
        name: "Technical Writing",
        totalClasses: 16,
        attended: 0,
        percentage: 0
      }
    ];
    
    // Count attendance for each course (simplified for now)
    const presentDays = records.filter(r => r.status === 'present').length;
    
    // Distribute the present days across courses proportionally
    mockCourses.forEach(course => {
      // This is a simplified approach - in a real app you'd have course-specific attendance
      const coursePresentDays = Math.floor(presentDays * (course.totalClasses / 96));
      course.attended = Math.min(coursePresentDays, course.totalClasses);
      course.percentage = (course.attended / course.totalClasses) * 100;
    });
    
    setCourses(mockCourses);
  };
  
  const generateDailyAttendance = (records: AttendanceRecord[]) => {
    const daysInMonth = 30;
    const today = new Date();
    
    // Create a map of date -> status for quick lookup
    const dateStatusMap = new Map<string, string>();
    records.forEach(record => {
      const recordDate = new Date(record.date);
      // Only include records from the current month
      if (recordDate.getMonth() === today.getMonth() && 
          recordDate.getFullYear() === today.getFullYear()) {
        const day = recordDate.getDate();
        const status = record.status === 'present' ? 'P' : 
                      record.status === 'absent' ? 'A' : 
                      record.status === 'late' ? 'L' : 'E'; // E for excused
        dateStatusMap.set(day.toString(), status);
      }
    });
    
    // Generate daily attendance array
    const attendance = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date();
      date.setDate(day);
      
      // Weekend check - make weekends non-teaching days
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // For days in the future, no status yet
      if (day > new Date().getDate()) {
        return {
          day,
          date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          status: '-',
          isWeekend
        };
      }
      
      // For past days, get status from records or assign default
      let status = dateStatusMap.get(day.toString()) || '-';
      
      if (isWeekend) {
        status = '-'; // Non-teaching day
      }
      
      return {
        day,
        date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        status,
        isWeekend
      };
    });
    
    setDailyAttendance(attendance);
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
                
                {/* Course-wise Attendance Summary */}
                <h3 className="font-semibold text-lg mb-4">Course-wise Attendance Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mb-6">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="p-2 text-left">Course Code</th>
                        <th className="p-2 text-left">Course Name</th>
                        <th className="p-2 text-center">Total Classes</th>
                        <th className="p-2 text-center">Classes Attended</th>
                        <th className="p-2 text-center">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-b">
                          <td className="p-2">{course.id}</td>
                          <td className="p-2">{course.name}</td>
                          <td className="p-2 text-center">{course.totalClasses}</td>
                          <td className="p-2 text-center">{course.attended}</td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              course.percentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {course.percentage.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-secondary/60 font-medium">
                        <td className="p-2" colSpan={2}>Overall</td>
                        <td className="p-2 text-center">{totalClasses}</td>
                        <td className="p-2 text-center">{totalAttended}</td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            parseFloat(overallPercentage) >= 75 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {overallPercentage}%
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Daily Attendance */}
                <h3 className="font-semibold text-lg mb-4">Daily Attendance</h3>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {dailyAttendance.map((day) => (
                    <div 
                      key={day.day} 
                      className={`p-2 text-center rounded-md ${
                        day.isWeekend 
                          ? 'bg-secondary/30 text-muted-foreground' 
                          : day.status === 'P' 
                            ? 'bg-green-100 text-green-800' 
                            : day.status === 'A' 
                              ? 'bg-red-100 text-red-800' 
                              : day.status === 'L' 
                                ? 'bg-blue-100 text-blue-800'
                                : day.status === 'E'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-secondary/50'
                      }`}
                    >
                      <div className="text-xs">{day.date}</div>
                      <div className="font-medium">{day.status}</div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-sm mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 rounded-sm mr-2"></div>
                    <span>P: Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 rounded-sm mr-2"></div>
                    <span>A: Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 rounded-sm mr-2"></div>
                    <span>L: Late</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-100 rounded-sm mr-2"></div>
                    <span>E: Excused</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-secondary/30 rounded-sm mr-2"></div>
                    <span>-: Non-teaching day</span>
                  </div>
                </div>
                
                {/* Attendance Policy */}
                <Card className="bg-secondary/20">
                  <CardContent className="p-4 text-sm">
                    <h4 className="font-medium mb-2">Attendance Policy:</h4>
                    <ul className="space-y-1 list-disc pl-5">
                      <li>Minimum 75% attendance is required in each course to be eligible for examinations.</li>
                      <li>Medical leaves are considered only with valid documentation.</li>
                      <li>Students with attendance below 75% may request consideration with valid reasons.</li>
                    </ul>
                  </CardContent>
                </Card>
                
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
