
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "@/components/students/BasicInfoForm";
import { AcademicRecordsForm } from "@/components/students/AcademicRecordsForm";
import { useStudentForm } from "@/hooks/use-student-form";
import { Student } from "@/components/StudentCard";

interface StudentFormProps {
  initialStudent?: Student;
  onSuccess?: (student: Student) => void;
}

export function StudentForm({ initialStudent, onSuccess }: StudentFormProps) {
  const { 
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
    isEditing
  } = useStudentForm({ initialStudent, onSuccess });

  return (
    <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="academic">Academic Records</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicInfoForm 
          formData={formData}
          onChange={setFormData}
          onImageUploaded={handleImageUploaded}
          loading={loading}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </TabsContent>
      
      <TabsContent value="academic">
        <AcademicRecordsForm
          marksheet10th={marksheet10th}
          marksheet12th={marksheet12th}
          onMarksheet10thChange={setMarksheet10th}
          onMarksheet12thChange={setMarksheet12th}
          loading={loading}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </TabsContent>
    </Tabs>
  );
}
