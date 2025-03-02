
import { useState } from "react";
import { AcademicRecord } from "@/components/marksheets/StandardTenMarksheet";
import { supabase } from "@/integrations/supabase/client";

interface UseAcademicRecordsProps {
  studentId?: string;
}

export function useAcademicRecords({ studentId }: UseAcademicRecordsProps) {
  const [marksheet10th, setMarksheet10th] = useState<AcademicRecord>({
    type: "10th Standard",
    year: "",
    school: "",
    board: "",
    percentage: "",
    marks: [{ subject: "", marks: "", maxMarks: "100" }]
  });
  
  const [marksheet12th, setMarksheet12th] = useState<AcademicRecord>({
    type: "12th Standard",
    year: "",
    school: "",
    board: "",
    percentage: "",
    marks: [{ subject: "", marks: "", maxMarks: "100" }]
  });

  const fetchAcademicRecords = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('marksheet_10th, marksheet_12th')
        .eq('id', studentId)
        .maybeSingle(); // Using maybeSingle instead of single for better error handling
        
      if (error) {
        throw error;
      }
      
      if (data) {
        if (data.marksheet_10th) {
          // Type cast the JSON data to AcademicRecord
          const record10th = data.marksheet_10th as unknown as AcademicRecord;
          if (record10th && typeof record10th === 'object' && 'marks' in record10th) {
            setMarksheet10th(record10th);
          }
        }
        
        if (data.marksheet_12th) {
          // Type cast the JSON data to AcademicRecord
          const record12th = data.marksheet_12th as unknown as AcademicRecord;
          if (record12th && typeof record12th === 'object' && 'marks' in record12th) {
            setMarksheet12th(record12th);
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching academic records:", error);
    }
  };

  return {
    marksheet10th,
    setMarksheet10th,
    marksheet12th, 
    setMarksheet12th,
    fetchAcademicRecords
  };
}
