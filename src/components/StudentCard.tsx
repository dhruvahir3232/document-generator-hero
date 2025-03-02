
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email?: string;
  photo_url?: string;
  class?: string;
  has_academic_records?: boolean;
}

interface StudentCardProps {
  student: Student;
  onSelect: (student: Student) => void;
  selected?: boolean;
}

export function StudentCard({ student, onSelect, selected }: StudentCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-medium cursor-pointer ${
        selected ? "border-primary border-2" : ""
      }`}
      onClick={() => onSelect(student)}
    >
      <CardContent className="p-6 flex items-center space-x-4">
        <Avatar className="h-14 w-14 border">
          {student.photo_url ? (
            <AvatarImage src={student.photo_url} alt={student.name} />
          ) : (
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {getInitials(student.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{student.name}</h3>
          {student.email && (
            <p className="text-sm text-muted-foreground truncate">{student.email}</p>
          )}
          <div className="flex items-center space-x-2">
            {student.class && (
              <p className="text-sm text-muted-foreground truncate">Class: {student.class}</p>
            )}
            {student.has_academic_records && (
              <span className="inline-flex items-center text-xs text-blue-600">
                <BookOpen className="h-3 w-3 mr-1" />
                Academic records
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
