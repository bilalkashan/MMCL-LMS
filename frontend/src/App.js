import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RefreshHandler from "./RefreshHandler";
import ProtectedRoute from "./ProtectedRoute";

// Import all your pages
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import ForgetPassword from "./pages/forgetpassowrd/forgetpassword";
import AdminDashboard from "./admin/admindashboard/adminDashboard";
import About from "./pages/about/about";
import AdviserSlots from "./admin/adviser/adviserSlots";
import AdviserAvailiblity from "./pages/adviser/AdviserAvailiblity";
import DataSet from "./pages/datasets/dataSet";
import AdvisorDetails from "./pages/advisorDetails/advisorDetails";
import RequestUsers from "./admin/requestUsers/requestUsers";
import Announcements from "./admin/Announcements/Announcements";
import VerifiedOtp from "./verifiedOtp/verifiedOtp";
import Result from "./teacher/result";
import FYPResult from "./pages/result/fypresult";
import AddTeacher from "./admin/addTeacher/AddTeacher";
import TeacherSlots from "./teacher/teacherSlot";
import SlotRequests from "./teacher/slotRequest/slotRequests";
import AdviserRequests from "./pages/adviser/AdviserRequest/AdviserRequests";
import ProjectIdea from "./admin/projectidea/projectIdea";
import OPenProjectIdea from "./pages/projectIdea/openProjectIdea";
import ResourceFiles from "./admin/ResourceFile/ResouceFiles";
import ResourceFile from "./pages/resourceFile/resourceFiles";
import TeacherFypApprovals from "./teacher/TeacherFypApprovals";
import Home from "./pages/home/home";
import LoginSignupWrapper from "./LoginSignupWrapper/LoginSignupWrapper";
import EmployeeProgressGraph from "./Component/EmployeeProgressGraph/EmployeeProgressGraph";
import UserDashboard from "./pages/userdashboard/userdashboard";
import AddCourse from "./admin/Course/AddCourse";
import ViewCourses from "./admin/Course/ViewCourses";
import AvailableCourses from "./pages/EmployeeCourse/AvailableCourses";
import CourseDetail from "./pages/EmployeeCourse/CourseDetail";

// Wrapper to easily add protection and allowedRole to routes
const Protected = ({ element, allowedRole }) => (
  <ProtectedRoute element={element} allowedRole={allowedRole} />
);

// Define all routes here
const router = createBrowserRouter(
  [
    // Public routes
    { path: "/loginwrapper", element: <LoginSignupWrapper /> },
    { path: "/", element: <Navigate to="/home" replace /> },
    { path: "/home", element: <Protected element={<Home />} /> },
    { path: "/signup", element: <Protected element={<Signup />} /> },
    { path: "/login", element: <Protected element={<Login />} /> },
    { path: "/forgetpassword", element: <Protected element={<ForgetPassword />} /> },
    { path: "/about", element: <About /> },
    { path: "/verifiedotp", element: <VerifiedOtp /> },

    // User routes
    { path: "/home", element: <Protected element={<Home />} allowedRole="user" /> },
    { path: "/adviserAvailibilty", element: <Protected element={<AdviserAvailiblity />} allowedRole="user" /> },
    { path: "/advisordetails", element: <Protected element={<AdvisorDetails />} allowedRole="user" /> },
    { path: "/certificates", element: <Protected element={<DataSet />} allowedRole="user" /> },
    { path: "/fypresult", element: <Protected element={<FYPResult />} allowedRole="user" /> },
    { path: "/userdashboard", element: <Protected element={<UserDashboard />} allowedRole="user" /> },
    { path: "/adviser_requests", element: <Protected element={<AdviserRequests />} allowedRole="user" /> },
    { path: "/open-ideas", element: <Protected element={<OPenProjectIdea />} allowedRole="user" /> },
    { path: "/resource-file", element: <Protected element={<ResourceFile />} allowedRole="user" /> },

    // Employee course routes
    { path: "/courses", element: <Protected element={<AvailableCourses />} allowedRole="user" /> },
    { path: "/course/:courseId", element: <Protected element={<CourseDetail />} allowedRole="user" /> },

    // Admin routes
    { path: "/employee-progress", element: <Protected element={<EmployeeProgressGraph />} allowedRole="admin" /> },
    { path: "/adminDashboard", element: <Protected element={<AdminDashboard />} allowedRole="admin" /> },
    { path: "/request-users", element: <Protected element={<RequestUsers />} allowedRole="admin" /> },
    { path: "/noticeboard", element: <Protected element={<Announcements />} allowedRole="admin" /> },
    { path: "/adviserslist", element: <Protected element={<AdviserSlots />} allowedRole="admin" /> },
    { path: "/result", element: <Protected element={<Result />} allowedRole="admin" /> },
    { path: "/addTeacher", element: <Protected element={<AddTeacher />} allowedRole="admin" /> },
    { path: "/projectIdea", element: <Protected element={<ProjectIdea />} allowedRole="admin" /> },
    { path: "/resourceFile", element: <Protected element={<ResourceFiles />} allowedRole="admin" /> },
    { path: "/admin/add-course", element: <Protected element={<AddCourse />} allowedRole="admin" /> },
    { path: "/admin/view-courses", element: <Protected element={<ViewCourses />} allowedRole="admin" /> },

    // Teacher routes
    { path: "/teacherDashboard", element: <Protected element={<AdminDashboard allowedRole="user" />} /> },
    { path: "/teacherslot", element: <Protected element={<TeacherSlots />} allowedRole="user" /> },
    { path: "/slotRequests", element: <Protected element={<SlotRequests />} allowedRole="user" /> },
    { path: "/submittedfyp", element: <Protected element={<TeacherFypApprovals />} allowedRole="user" /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <div className="App">
      <RefreshHandler />
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
