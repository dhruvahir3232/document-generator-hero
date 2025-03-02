
import './App.css';
import { Toaster } from 'sonner';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ManageStudents from "@/pages/ManageStudents";
import StudentsList from "@/pages/StudentsList";
import Attendance from "@/pages/Attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/manage-students" element={<StudentsList />} />
        <Route path="/manage-students/new" element={<ManageStudents />} />
        <Route path="/manage-students/:id" element={<ManageStudents />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
