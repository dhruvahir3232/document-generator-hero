
import { useState, useEffect } from "react";
import { Student } from "@/components/StudentCard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AttendanceRecord } from "@/types/attendance";

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
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [savingStudentId, setSavingStudentId] = useState<string | null>(null);
  const [fetchingRecords, setFetchingRecords] = useState(true);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate();
    }
  }, [selectedDate]);

  const fetchAttendanceForDate = async () => {
    setFetchingRecords(true);
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', selectedDate);
      
      if (error) {
        throw error;
      }
      
      // Create a map of student_id -> attendance record
      const recordsMap: Record<string, AttendanceRecord> = {};
      data.forEach((record: AttendanceRecord) => {
        recordsMap[record.student_id] = record;
      });
      
      setAttendanceRecords(recordsMap);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast({
        title: "Error",
        description: "Failed to load attendance records.",
        variant: "destructive"
      });
    } finally {
      setFetchingRecords(false);
    }
  };

  const markAttendance = async (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setSavingStudentId(studentId);
    try {
      const existingRecord = attendanceRecords[studentId];
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('attendance_records')
          .update({ 
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('attendance_records')
          .insert({
            student_id: studentId,
            date: selectedDate,
            status
          })
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Update local state with new record
          setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: data[0] as AttendanceRecord
          }));
        }
      }
      
      // Update local state to reflect the change
      setAttendanceRecords(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          student_id: studentId,
          date: selectedDate,
          status
        } as AttendanceRecord
      }));
      
      toast({
        title: "Attendance Recorded",
        description: `Marked ${status} for the student.`
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to record attendance.",
        variant: "destructive"
      });
    } finally {
      setSavingStudentId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-3 max-w-md mx-auto">
            <h3 className="text-xl font-medium">No Students Found</h3>
            <p className="text-muted-foreground">
              Add students to the system to mark their attendance.
            </p>
            <Button asChild className="mt-4">
              <a href="/manage-students/new">Add Student</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
                      <div className="flex space-x-2">
                        <Button 
                          variant={status === "present" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => markAttendance(student.id, "present")}
                          disabled={savingStudentId === student.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button 
                          variant={status === "absent" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => markAttendance(student.id, "absent")}
                          disabled={savingStudentId === student.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button 
                          variant={status === "late" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => markAttendance(student.id, "late")}
                          disabled={savingStudentId === student.id}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                        <Button 
                          variant={status === "excused" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => markAttendance(student.id, "excused")}
                          disabled={savingStudentId === student.id}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Excused
                        </Button>
                      </div>
                      {savingStudentId === student.id && (
                        <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                          Saving...
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function AttendanceStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "present":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Present
        </Badge>
      );
    case "absent":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Absent
        </Badge>
      );
    case "late":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" /> Late
        </Badge>
      );
    case "excused":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="h-3 w-3 mr-1" /> Excused
        </Badge>
      );
    default:
      return null;
  }
}
