
import { useState, useEffect } from "react";
import { Student } from "@/components/StudentCard";
import { useAcademicRecords } from "@/hooks/use-academic-records";
import { useStudentSubmit } from "@/hooks/use-student-submit";

interface UseStudentFormProps {
  initialStudent?: Student;
  onSuccess?: (student: Student) => void;
}

export function useStudentForm({ initialStudent, onSuccess }: UseStudentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    picture: ""
  });
  
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  const { 
    marksheet10th,
    setMarksheet10th,
    marksheet12th, 
    setMarksheet12th,
    fetchAcademicRecords
  } = useAcademicRecords({ studentId: initialStudent?.id });

  // Load initial student data if editing
  useEffect(() => {
    if (initialStudent) {
      setFormData({
        name: initialStudent.name || "",
        email: initialStudent.email || "",
        class: initialStudent.class || "",
        picture: initialStudent.photo_url || ""
      });
      
      // Fetch academic records
      if (initialStudent.id) {
        fetchAcademicRecords(initialStudent.id);
      }
    }
  }, [initialStudent]);
  
  const handleImageUploaded = (url: string) => {
    console.log("Image uploaded with URL:", url);
    setFormData((prev) => ({ ...prev, picture: url }));
  };

  const getFormData = () => formData;
  const getActiveTab = () => activeTab;
  const getMarksheet10th = () => marksheet10th;
  const getMarksheet12th = () => marksheet12th;
  
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      class: "",
      picture: ""
    });
    
    setMarksheet10th({
      type: "10th Standard",
      year: "",
      school: "",
      board: "",
      percentage: "",
      marks: [{ subject: "", marks: "", maxMarks: "100" }]
    });
    
    setMarksheet12th({
      type: "12th Standard",
      year: "",
      school: "",
      board: "",
      percentage: "",
      marks: [{ subject: "", marks: "", maxMarks: "100" }]
    });
  };

  const { 
    loading, 
    handleSubmit 
  } = useStudentSubmit({
    initialStudent,
    onSuccess,
    getFormData,
    getActiveTab,
    getMarksheet10th,
    getMarksheet12th,
    resetForm
  });

  return {
    formData,
    setFormData,
    loading,
    activeTab,
    setActiveTab,
    marksheet10th,
    setMarksheet10th,
    marksheet12th, 
    setMarksheet12th,
    handleImageUploaded,
    handleSubmit,
    isEditing: !!initialStudent
  };
}
