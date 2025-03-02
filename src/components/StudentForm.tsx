
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { StandardTenMarksheet, AcademicRecord } from "@/components/marksheets/StandardTenMarksheet";
import { StandardTwelveMarksheet } from "@/components/marksheets/StandardTwelveMarksheet";
import { BasicInfoForm } from "@/components/students/BasicInfoForm";

interface StudentFormProps {
  initialStudent?: Student;
  onSuccess?: (student: Student) => void;
}

export function StudentForm({ initialStudent, onSuccess }: StudentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    picture: ""
  });
  
  const [activeTab, setActiveTab] = useState<string>("basic");
  
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
      fetchAcademicRecords(initialStudent.id);
    }
  }, [initialStudent]);
  
  const fetchAcademicRecords = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('marksheet_10th, marksheet_12th')
        .eq('id', studentId)
        .single();
        
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

  const handleImageUploaded = (url: string) => {
    console.log("Image uploaded with URL:", url);
    setFormData((prev) => ({ ...prev, picture: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
          isEditing={!!initialStudent}
        />
      </TabsContent>
      
      <TabsContent value="academic">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 10th Standard Marksheet */}
          <StandardTenMarksheet 
            marksheet={marksheet10th}
            onChange={setMarksheet10th}
          />
          
          {/* 12th Standard Marksheet */}
          <StandardTwelveMarksheet 
            marksheet={marksheet12th}
            onChange={setMarksheet12th}
          />
          
          <div className="flex justify-end">
            <Button type="submit" className="w-40" disabled={loading}>
              {loading ? "Saving..." : initialStudent ? "Update Records" : "Save Records"}
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}
