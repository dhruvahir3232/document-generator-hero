
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get initials from name (e.g., "John Doe" => "JD")
export function getInitials(name: string): string {
  if (!name) return "";
  
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase();
}

// Find student by name (partial match) - this would be replaced by a database query
export function findStudentsByName(students: any[], name: string) {
  if (!name) return [];
  
  const normalizedName = name.toLowerCase();
  
  return students.filter(student => 
    student.name.toLowerCase().includes(normalizedName)
  );
}

// Generate mock students data
export function generateMockStudents() {
  return [
    {
      id: "ST20230001",
      name: "John Smith",
      email: "john.smith@university.edu",
      class: "Computer Science - Year 2",
      photo_url: "https://i.pravatar.cc/300?u=john"
    },
    {
      id: "ST20230002",
      name: "Emily Johnson",
      email: "emily.j@university.edu",
      class: "Physics - Year 3",
      photo_url: "https://i.pravatar.cc/300?u=emily"
    },
    {
      id: "ST20230003",
      name: "Michael Davis",
      email: "michael.d@university.edu",
      class: "Mathematics - Year 1",
      photo_url: "https://i.pravatar.cc/300?u=michael"
    },
    {
      id: "ST20230004",
      name: "Sarah Wilson",
      email: "sarah.w@university.edu",
      class: "Chemistry - Year 4",
      photo_url: "https://i.pravatar.cc/300?u=sarah"
    },
    {
      id: "ST20230005",
      name: "James Miller",
      email: "james.m@university.edu",
      class: "Computer Science - Year 3",
      photo_url: "https://i.pravatar.cc/300?u=james"
    }
  ];
}
