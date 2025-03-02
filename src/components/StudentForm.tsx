
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/components/StudentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";

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

  // Load initial student data if editing
  useEffect(() => {
    if (initialStudent) {
      setFormData({
        name: initialStudent.name || "",
        email: initialStudent.email || "",
        class: initialStudent.class || "",
        picture: initialStudent.photo_url || ""
      });
    }
  }, [initialStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Student name is required");
      }

      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        class: formData.class.trim() || null,
        picture: formData.picture || null
      };

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

      // Map to our Student type
      const savedStudent: Student = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        class: response.data.class,
        photo_url: response.data.picture
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
    setFormData((prev) => ({ ...prev, picture: url }));
  };

  return (
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
  );
}
