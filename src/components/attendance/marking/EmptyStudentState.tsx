
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyStudentState() {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="space-y-3 max-w-md mx-auto">
          <h3 className="text-xl font-medium">No Students Found</h3>
          <p className="text-muted-foreground">
            Add students to the system to mark their attendance.
          </p>
          <Button asChild className="mt-4">
            <a href="/manage-students/new">Add Student</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
