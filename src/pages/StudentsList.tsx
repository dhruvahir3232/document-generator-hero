import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Student, StudentCard } from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, ArrowLeft, Loader2 } from "lucide-react";

export default function StudentsList() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.class && student.class.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, class, picture, marksheet_10th, marksheet_12th')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      const mappedStudents: Student[] = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        photo_url: student.picture,
        has_academic_records: Boolean(student.marksheet_10th || student.marksheet_12th)
      }));

      setStudents(mappedStudents);
      setFilteredStudents(mappedStudents);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-primary-foreground/90 hover:text-primary-foreground transition mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">
              Manage Students
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button asChild>
              <Link to="/manage-students">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Student
              </Link>
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="border-b bg-muted/40 p-4">
              <h2 className="text-lg font-medium">Students</h2>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-280px)] rounded-b-lg">
                  {filteredStudents.length > 0 ? (
                    <div className="grid gap-0.5 p-1">
                      {filteredStudents.map((student) => (
                        <StudentListItem key={student.id} student={student} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">
                        {searchQuery.trim() !== "" 
                          ? "No students match your search." 
                          : "No students found. Add your first student using the button above."}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StudentListItem({ student }: { student: Student }) {
  return (
    <div className="group relative rounded-md overflow-hidden border bg-card hover:bg-accent/50 transition-colors">
      <StudentCard 
        student={student} 
        onSelect={() => {}} // Not using selection functionality here
      />
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/manage-students/${student.id}`}>
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}
