
import { Card, CardContent } from "@/components/ui/card";

export function AttendancePolicy() {
  return (
    <Card className="bg-secondary/20">
      <CardContent className="p-4 text-sm">
        <h4 className="font-medium mb-2">Attendance Policy:</h4>
        <ul className="space-y-1 list-disc pl-5">
          <li>Minimum 75% attendance is required in each course to be eligible for examinations.</li>
          <li>Medical leaves are considered only with valid documentation.</li>
          <li>Students with attendance below 75% may request consideration with valid reasons.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
