
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AttendanceRecord, SupabaseAttendanceRecord } from "@/types/attendance";

export function useAttendanceData(selectedDate: string) {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [savingStudentId, setSavingStudentId] = useState<string | null>(null);
  const [fetchingRecords, setFetchingRecords] = useState(true);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate();
    }
  }, [selectedDate]);

  const isValidStatus = (status: string): status is "present" | "absent" | "late" | "excused" => {
    return ["present", "absent", "late", "excused"].includes(status);
  };

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
      data.forEach((record: SupabaseAttendanceRecord) => {
        // Validate that status is one of the allowed values
        if (isValidStatus(record.status)) {
          recordsMap[record.student_id] = {
            ...record,
            status: record.status as "present" | "absent" | "late" | "excused"
          };
        }
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

  return {
    attendanceRecords,
    savingStudentId,
    fetchingRecords,
    markAttendance
  };
}
