
import { useState, useEffect } from "react";
import { Student } from "@/components/StudentCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useStudentDetails(id: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);
  
  useEffect(() => {
    if (id) {
      fetchStudent(id);
    }
  }, [id]);
  
  const fetchStudent = async (studentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Make sure to log the data to see what's coming back
        console.log("Fetched student data:", data);
        
        setStudent({
          id: data.id,
          name: data.name,
          email: data.email,
          class: data.class,
          photo_url: data.picture,
          has_academic_records: Boolean(data.marksheet_10th || data.marksheet_12th)
        });
      }
    } catch (error: any) {
      console.error("Error fetching student:", error);
      toast({
        title: "Error",
        description: "Could not find the requested student.",
        variant: "destructive"
      });
      navigate("/manage-students");
    } finally {
      setLoading(false);
    }
  };

  return {
    student,
    loading,
    isEditing
  };
}
