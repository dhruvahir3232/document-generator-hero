
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, CalendarCheck, Home } from "lucide-react";

export const NavigationActions = () => {
  return (
    <div className="flex justify-between mb-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/attendance">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Attendance
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/manage-students">
            <Users className="mr-2 h-4 w-4" />
            Manage Students
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/manage-students/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>
    </div>
  );
};
