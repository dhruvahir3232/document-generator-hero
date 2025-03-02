
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/components/StudentCard";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { AcademicRecord } from "@/components/marksheets/StandardTenMarksheet";

interface UseStudentSubmitProps {
  initialStudent?: Student;
  onSuccess?: (student: Student) => void;
  getFormData: () => {
    name: string;
    email: string;
    class: string;
    picture: string;
  };
  getActiveTab: () => string;
  getMarksheet10th: () => AcademicRecord;
  getMarksheet12th: () => AcademicRecord;
  resetForm: () => void;
}

export function useStudentSubmit({
  initialStudent,
  onSuccess,
  getFormData,
  getActiveTab,
  getMarksheet10th,
  getMarksheet12th,
  resetForm
}: UseStudentSubmitProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = getFormData();
      const activeTab = getActiveTab();
      const marksheet10th = getMarksheet10th();
      const marksheet12th = getMarksheet12th();

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Student name is required");
      }

      // Convert AcademicRecord to Json by direct assignment (TypeScript will allow this)
      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        class: formData.class.trim() || null,
        picture: formData.picture || null,
        // Only include academic data if we're on that tab
        marksheet_10th: activeTab === "academic" ? marksheet10th as unknown as Json : null,
        marksheet_12th: activeTab === "academic" ? marksheet12th as unknown as Json : null
      };

      console.log("Submitting student data:", studentData);

      let response;

      if (initialStudent) {
        // Update existing student
        response = await supabase
          .from("students")
          .update(studentData)
          .eq("id", initialStudent.id)
          .select()
          .single();
      } else {
        // Insert new student
        response = await supabase
          .from("students")
          .insert(studentData)
          .select()
          .single();
      }

      if (response.error) {
        throw response.error;
      }

      const hasAcademicRecords = Boolean(
        response.data.marksheet_10th || response.data.marksheet_12th
      );

      // Map to our Student type
      const savedStudent: Student = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        class: response.data.class,
        photo_url: response.data.picture,
        has_academic_records: hasAcademicRecords
      };

      toast({
        title: initialStudent ? "Student Updated" : "Student Added",
        description: `${savedStudent.name} has been ${initialStudent ? "updated" : "added"} successfully.`
      });

      // Reset form if not editing
      if (!initialStudent) {
        resetForm();
      }

      // Callback with the saved student
      if (onSuccess) {
        onSuccess(savedStudent);
      }
    } catch (error: any) {
      console.error("Error saving student:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
}
