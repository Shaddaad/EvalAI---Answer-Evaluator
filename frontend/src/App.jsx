import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Exams from "./pages/Exams"
import Support from "./pages/Support"
import Roadmap from "./pages/Roadmap"
import AdminDashboard from "./pages/AdminDashboard"
import AdminTeachers from "./pages/AdminTeachers"
import AdminClasses from "./pages/AdminClasses"
import AdminStudents from "./pages/AdminStudents"
import AdminClassDetail from "./pages/AdminClassDetail"
import StudentDashboard from "./pages/StudentDashboard"

import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-teachers" element={<AdminTeachers />} />
          <Route path="/admin-classes" element={<AdminClasses />} />
          <Route path="/admin-students" element={<AdminStudents />} />
          <Route path="/admin-class/:classId" element={<AdminClassDetail />} />

          {/* Student routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/* Teacher routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/support" element={<Support />} />
          <Route path="/roadmap" element={<Roadmap />} />

        </Route>

      </Routes>

    </BrowserRouter>

  )

}

export default App