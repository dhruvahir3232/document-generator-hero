
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

export const NavigationActions = () => {
  return (
    <div className="flex justify-end mb-6 gap-3">
      <Button asChild variant="outline" size="sm">
        <Link to="/manage-students">
          <Users className="mr-2 h-4 w-4" />
          Manage Students
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/manage-students">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Link>
      </Button>
    </div>
  );
};
