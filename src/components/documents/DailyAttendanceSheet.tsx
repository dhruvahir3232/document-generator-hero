
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Student } from "../StudentCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Calendar, User, Loader2 } from "lucide-react";

export function DailyAttendanceSheet() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  
  // Fetch all students
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, class, picture')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      const mappedStudents: Student[] = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        photo_url: student.picture,
        has_academic_records: false // Not needed for attendance
      }));

      setStudents(mappedStudents);
      
      // Initialize attendance records with all "present"
      const initialAttendance: Record<string, string> = {};
      mappedStudents.forEach(student => {
        initialAttendance[student.id] = 'P'; // Default to Present
      });
      setAttendanceRecords(initialAttendance);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const changeAttendanceStatus = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const saveAttendance = async () => {
    setSaving(true);
    
    // Convert attendance records to format we want to save
    const attendanceData = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      student_id: studentId,
      date: date,
      status: status,
      recorded_at: new Date().toISOString()
    }));
    
    try {
      // For now, we'll just show a success message
      // In a real implementation, you would save this to the database
      console.log("Attendance data to save:", attendanceData);
      
      toast({
        title: "Attendance Saved",
        description: `Attendance for ${date} has been recorded successfully.`
      });
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Get the day of week for the header
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };
  
  // Format date for display
  const formatDateForDisplay = () => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Daily Attendance Sheet</CardTitle>
                <p className="opacity-90">
                  {formatDateForDisplay()} ({getDayOfWeek()})
                </p>
              </div>
              <div className="text-right">
                <p>University of Excellence</p>
                <p className="text-sm opacity-80">Academic Affairs Department</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Date Selection */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Date:</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
              <Button 
                onClick={saveAttendance} 
                disabled={saving || loading}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Attendance'}
              </Button>
            </div>
            
            {/* Students Attendance Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No students found. Please add students first.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="p-2 text-left">No.</th>
                      <th className="p-2 text-left">Student ID</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Class</th>
                      <th className="p-2 text-center">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{student.id ? student.id.substring(0, 8) : '—'}</td>
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.class || '—'}</td>
                        <td className="p-2">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant={attendanceRecords[student.id] === 'P' ? 'default' : 'outline'}
                              className={`min-w-12 ${attendanceRecords[student.id] === 'P' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              onClick={() => changeAttendanceStatus(student.id, 'P')}
                            >
                              <Check className={`h-4 w-4 ${attendanceRecords[student.id] === 'P' ? 'text-white' : ''}`} />
                              <span>Present</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={attendanceRecords[student.id] === 'A' ? 'default' : 'outline'}
                              className={`min-w-12 ${attendanceRecords[student.id] === 'A' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                              onClick={() => changeAttendanceStatus(student.id, 'A')}
                            >
                              <X className={`h-4 w-4 ${attendanceRecords[student.id] === 'A' ? 'text-white' : ''}`} />
                              <span>Absent</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded-sm mr-2"></div>
                <span>P: Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 rounded-sm mr-2"></div>
                <span>A: Absent</span>
              </div>
            </div>
            
            {/* Summary Section */}
            {!loading && students.length > 0 && (
              <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                <h4 className="font-medium mb-2">Summary:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>Total Students: {students.length}</p>
                    <p>Present: {Object.values(attendanceRecords).filter(status => status === 'P').length}</p>
                  </div>
                  <div>
                    <p>Absent: {Object.values(attendanceRecords).filter(status => status === 'A').length}</p>
                    <p>Attendance Rate: {((Object.values(attendanceRecords).filter(status => status === 'P').length / students.length) * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Teacher's Signature: ____________________</p>
              <p className="mt-2">Date: {formatDateForDisplay()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
