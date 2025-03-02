
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/components/StudentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface StudentFormProps {
  initialStudent?: Student;
  onSuccess?: (student: Student) => void;
}

interface Mark {
  subject: string;
  marks: string;
  maxMarks: string;
}

interface AcademicRecord {
  type: string;
  year: string;
  school: string;
  board: string;
  percentage?: string;
  marks: Mark[];
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handle10thChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarksheet10th((prev) => ({ ...prev, [name]: value }));
  };
  
  const handle12thChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarksheet12th((prev) => ({ ...prev, [name]: value }));
  };
  
  const handle10thMarksChange = (index: number, field: 'subject' | 'marks' | 'maxMarks', value: string) => {
    setMarksheet10th((prev) => {
      const updatedMarks = [...prev.marks];
      updatedMarks[index] = { ...updatedMarks[index], [field]: value };
      return { ...prev, marks: updatedMarks };
    });
  };
  
  const handle12thMarksChange = (index: number, field: 'subject' | 'marks' | 'maxMarks', value: string) => {
    setMarksheet12th((prev) => {
      const updatedMarks = [...prev.marks];
      updatedMarks[index] = { ...updatedMarks[index], [field]: value };
      return { ...prev, marks: updatedMarks };
    });
  };
  
  const add10thSubject = () => {
    setMarksheet10th((prev) => ({
      ...prev,
      marks: [...prev.marks, { subject: "", marks: "", maxMarks: "100" }]
    }));
  };
  
  const add12thSubject = () => {
    setMarksheet12th((prev) => ({
      ...prev,
      marks: [...prev.marks, { subject: "", marks: "", maxMarks: "100" }]
    }));
  };
  
  const remove10thSubject = (index: number) => {
    setMarksheet10th((prev) => {
      const updatedMarks = [...prev.marks];
      updatedMarks.splice(index, 1);
      return { ...prev, marks: updatedMarks };
    });
  };
  
  const remove12thSubject = (index: number) => {
    setMarksheet12th((prev) => {
      const updatedMarks = [...prev.marks];
      updatedMarks.splice(index, 1);
      return { ...prev, marks: updatedMarks };
    });
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

  const handleImageUploaded = (url: string) => {
    console.log("Image uploaded with URL:", url);
    setFormData((prev) => ({ ...prev, picture: url }));
  };

  return (
    <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="academic">Academic Records</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-square overflow-hidden rounded-md mb-4">
                    <ImageUpload 
                      initialImage={formData.picture} 
                      onImageUploaded={handleImageUploaded} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Upload a student photo here
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Student Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter student email (optional)"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="class" className="text-sm font-medium">
                  Class / Grade
                </label>
                <Input
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="Enter class or grade (optional)"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : initialStudent ? "Update Student" : "Add Student"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="academic">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 10th Standard Marksheet */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">10th Standard Marksheet</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="year10" className="text-sm font-medium">Year</label>
                  <Input
                    id="year10"
                    name="year"
                    value={marksheet10th.year}
                    onChange={handle10thChange}
                    placeholder="Year of completion"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="board10" className="text-sm font-medium">Board/University</label>
                  <Input
                    id="board10"
                    name="board"
                    value={marksheet10th.board}
                    onChange={handle10thChange}
                    placeholder="CBSE, ICSE, State board, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="school10" className="text-sm font-medium">School/Institution</label>
                  <Input
                    id="school10"
                    name="school"
                    value={marksheet10th.school}
                    onChange={handle10thChange}
                    placeholder="School name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="percentage10" className="text-sm font-medium">Overall Percentage</label>
                  <Input
                    id="percentage10"
                    name="percentage"
                    value={marksheet10th.percentage}
                    onChange={handle10thChange}
                    placeholder="Overall percentage"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Subject-wise Marks</h4>
                
                {marksheet10th.marks.map((mark, index) => (
                  <div key={`10th-${index}`} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Subject name"
                        value={mark.subject}
                        onChange={(e) => handle10thMarksChange(index, 'subject', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Marks"
                        value={mark.marks}
                        onChange={(e) => handle10thMarksChange(index, 'marks', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Max marks"
                        value={mark.maxMarks}
                        onChange={(e) => handle10thMarksChange(index, 'maxMarks', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {marksheet10th.marks.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => remove10thSubject(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={add10thSubject}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* 12th Standard Marksheet */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">12th Standard Marksheet</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="year12" className="text-sm font-medium">Year</label>
                  <Input
                    id="year12"
                    name="year"
                    value={marksheet12th.year}
                    onChange={handle12thChange}
                    placeholder="Year of completion"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="board12" className="text-sm font-medium">Board/University</label>
                  <Input
                    id="board12"
                    name="board"
                    value={marksheet12th.board}
                    onChange={handle12thChange}
                    placeholder="CBSE, ICSE, State board, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="school12" className="text-sm font-medium">School/Institution</label>
                  <Input
                    id="school12"
                    name="school"
                    value={marksheet12th.school}
                    onChange={handle12thChange}
                    placeholder="School name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="percentage12" className="text-sm font-medium">Overall Percentage</label>
                  <Input
                    id="percentage12"
                    name="percentage"
                    value={marksheet12th.percentage}
                    onChange={handle12thChange}
                    placeholder="Overall percentage"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Subject-wise Marks</h4>
                
                {marksheet12th.marks.map((mark, index) => (
                  <div key={`12th-${index}`} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Subject name"
                        value={mark.subject}
                        onChange={(e) => handle12thMarksChange(index, 'subject', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Marks"
                        value={mark.marks}
                        onChange={(e) => handle12thMarksChange(index, 'marks', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Max marks"
                        value={mark.maxMarks}
                        onChange={(e) => handle12thMarksChange(index, 'maxMarks', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {marksheet12th.marks.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => remove12thSubject(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={add12thSubject}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
            </CardContent>
          </Card>
          
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
