
import { useState } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface StudentSearchProps {
  onSearch: (name: string) => void;
  isLoading?: boolean;
}

export function StudentSearch({ onSearch, isLoading = false }: StudentSearchProps) {
  const [studentName, setStudentName] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim()) {
      onSearch(studentName);
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="pl-10 h-12"
            />
            <SearchIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              size={18} 
            />
          </div>
          <Button 
            type="submit"
            disabled={!studentName.trim() || isLoading}
            className="h-12 px-6"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
