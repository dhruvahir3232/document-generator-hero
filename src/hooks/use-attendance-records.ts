
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AttendanceRecord } from "@/types/attendance";

interface UseAttendanceRecordsProps {
  studentId?: string;
  date?: string;
}

export function useAttendanceRecords({ studentId, date }: UseAttendanceRecordsProps = {}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch attendance records based on filters
  const fetchAttendanceRecords = async () => {
    if (!studentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('attendance_records').select('*');
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      if (date) {
        query = query.eq('date', date);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setAttendanceRecords(data as AttendanceRecord[]);
    } catch (err: any) {
      console.error("Error fetching attendance records:", err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to fetch attendance records.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Record new attendance
  const recordAttendance = async (
    studentId: string, 
    date: string, 
    status: "present" | "absent" | "late" | "excused",
    notes?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if record already exists for this student and date
      const { data: existingRecord } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('student_id', studentId)
        .eq('date', date)
        .maybeSingle();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('attendance_records')
          .update({ status, notes, updated_at: new Date().toISOString() })
          .eq('id', existingRecord.id)
          .select();
      } else {
        // Insert new record
        result = await supabase
          .from('attendance_records')
          .insert({ student_id: studentId, date, status, notes })
          .select();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Refresh the attendance records
      fetchAttendanceRecords();
      
      toast({
        title: existingRecord ? "Attendance Updated" : "Attendance Recorded",
        description: `Attendance for ${new Date(date).toLocaleDateString()} has been ${existingRecord ? 'updated' : 'recorded'}.`,
      });
      
      return result.data;
    } catch (err: any) {
      console.error("Error recording attendance:", err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to record attendance.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete an attendance record
  const deleteAttendanceRecord = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the attendance records
      fetchAttendanceRecords();
      
      toast({
        title: "Attendance Deleted",
        description: "The attendance record has been deleted.",
      });
      
      return true;
    } catch (err: any) {
      console.error("Error deleting attendance record:", err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to delete attendance record.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch records on mount or when filters change
  useEffect(() => {
    fetchAttendanceRecords();
  }, [studentId, date]);
  
  return {
    attendanceRecords,
    loading,
    error,
    fetchAttendanceRecords,
    recordAttendance,
    deleteAttendanceRecord
  };
}
