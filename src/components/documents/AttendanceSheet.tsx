
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "../StudentCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AttendanceSheetProps {
  student: Student;
}

export function AttendanceSheet({ student }: AttendanceSheetProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  // Mock data for attendance
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const courses = [
    { 
      id: "CS101",
      name: "Introduction to Computer Science",
      totalClasses: 24,
      attended: 22,
      percentage: 91.67
    },
    { 
      id: "CS201",
      name: "Data Structures and Algorithms",
      totalClasses: 24,
      attended: 20,
      percentage: 83.33
    },
    { 
      id: "MATH101",
      name: "Calculus I",
      totalClasses: 32,
      attended: 29,
      percentage: 90.63
    },
    { 
      id: "ENG201",
      name: "Technical Writing",
      totalClasses: 16,
      attended: 14,
      percentage: 87.50
    }
  ];
  
  // Generate random attendance data for the month (present, absent, leave)
  const daysInMonth = 30;
  const dailyAttendance = Array.from({ length: daysInMonth }, (_, i) => {
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
    
    // For past days, assign a status
    const rand = Math.random();
    let status = 'P'; // Present
    
    if (isWeekend) {
      status = '-'; // Non-teaching day
    } else if (rand < 0.1) {
      status = 'A'; // 10% chance of absence
    } else if (rand < 0.15) {
      status = 'L'; // 5% chance of leave
    }
    
    return {
      day,
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      status,
      isWeekend
    };
  });
  
  // Calculate overall attendance
  const totalClasses = courses.reduce((sum, course) => sum + course.totalClasses, 0);
  const totalAttended = courses.reduce((sum, course) => sum + course.attended, 0);
  const overallPercentage = ((totalAttended / totalClasses) * 100).toFixed(2);

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
            {/* Student Information */}
            <div className="mb-6 p-4 bg-secondary/40 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">STUDENT NAME</h3>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">STUDENT ID</h3>
                  <p className="font-medium">{student.id || "ST-" + Math.floor(10000 + Math.random() * 90000)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">PROGRAM</h3>
                  <p className="font-medium">{student.class || "Bachelor of Science in Computer Science"}</p>
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
                <span>L: Leave</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
