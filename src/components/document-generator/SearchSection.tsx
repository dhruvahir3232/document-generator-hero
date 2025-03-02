
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StudentSearch } from "@/components/StudentSearch";
import { StudentResultsList } from "@/components/StudentResultsList";
import { Student } from "@/components/StudentCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchSectionProps {
  onSelectStudent: (student: Student) => void;
  selectedStudent: Student | null;
}

export const SearchSection = ({ onSelectStudent, selectedStudent }: SearchSectionProps) => {
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (name: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('name', `%${name}%`);
      
      if (error) {
        throw error;
      }
      
      const students: Student[] = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        photo_url: student.picture
      }));
      
      setSearchResults(students);
      
      if (students.length === 1) {
        onSelectStudent(students[0]);
      } else if (selectedStudent) {
        // Reset selection if we have multiple results and a previous selection
        onSelectStudent(null);
      }
      
      if (students.length === 0) {
        toast.info("No students found with that name.");
      } else {
        toast.success(`Found ${students.length} student(s).`);
      }
      
    } catch (error) {
      console.error("Error searching for students:", error);
      toast.error("Failed to search for students. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-secondary/50 p-4 border-b">
        <h2 className="text-lg font-medium">Search Student</h2>
      </div>
      <CardContent className="p-4">
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-6 pr-4">
            <StudentSearch onSearch={handleSearch} isLoading={isSearching} />
            
            {hasSearched && (
              <>
                {isSearching ? (
                  <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-semibold">Loading Results</h2>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="p-4 flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {searchResults.length > 0 ? (
                      <StudentResultsList 
                        students={searchResults} 
                        selectedStudent={selectedStudent} 
                        onSelectStudent={onSelectStudent} 
                      />
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No students found. Try a different name.
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
