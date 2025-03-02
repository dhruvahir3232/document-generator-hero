
import { CourseAttendance } from "@/types/attendance";

interface CourseAttendanceSummaryProps {
  courses: CourseAttendance[];
  totalClasses: number;
  totalAttended: number;
  overallPercentage: string;
}

export function CourseAttendanceSummary({
  courses,
  totalClasses,
  totalAttended,
  overallPercentage
}: CourseAttendanceSummaryProps) {
  return (
    <>
      <h3 className="font-semibold text-lg mb-4">Course-wise Attendance Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-secondary">
              <th className="p-2 text-left">Course Code</th>
              <th className="p-2 text-left">Course Name</th>
              <th className="p-2 text-center">Total Classes</th>
              <th className="p-2 text-center">Classes Attended</th>
              <th className="p-2 text-center">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="p-2">{course.id}</td>
                <td className="p-2">{course.name}</td>
                <td className="p-2 text-center">{course.totalClasses}</td>
                <td className="p-2 text-center">{course.attended}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.percentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {course.percentage.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-secondary/60 font-medium">
              <td className="p-2" colSpan={2}>Overall</td>
              <td className="p-2 text-center">{totalClasses}</td>
              <td className="p-2 text-center">{totalAttended}</td>
              <td className="p-2 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  parseFloat(overallPercentage) >= 75 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {overallPercentage}%
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
