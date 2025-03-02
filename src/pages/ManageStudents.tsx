
import { Link, useParams, useNavigate } from "react-router-dom";
import { Student } from "@/components/StudentCard";
import { StudentForm } from "@/components/StudentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { useStudentDetails } from "@/hooks/use-student-details";

export default function ManageStudents() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, loading, isEditing } = useStudentDetails(id);
  
  const handleSuccess = (student: Student) => {
    if (isEditing) {
      // After editing, stay on the same page but with updated data
      // The hook will handle the state update automatically on next render
    } else {
      // After adding, redirect to edit the new student
      navigate(`/manage-students/${student.id}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-primary-foreground/90 hover:text-primary-foreground transition mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">
              {isEditing ? "Edit Student" : "Add New Student"}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              {isEditing && student && (
                <h2 className="text-xl font-medium">Editing: {student.name}</h2>
              )}
            </div>
            
            {isEditing && (
              <Button asChild variant="outline">
                <Link to="/manage-students">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Student
                </Link>
              </Button>
            )}
          </div>
          
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <StudentForm initialStudent={student} onSuccess={handleSuccess} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
