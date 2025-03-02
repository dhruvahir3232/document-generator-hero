
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export interface Student {
  id: string;
  name: string;
  email?: string;
  photo_url?: string;
  class?: string;
}

interface StudentCardProps {
  student: Student;
  onSelect: (student: Student) => void;
  selected?: boolean;
}

export function StudentCard({ student, onSelect }: StudentCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-medium">
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
          {student.class && (
            <p className="text-sm text-muted-foreground truncate">Class: {student.class}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
