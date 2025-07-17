import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RefreshHandler from "./RefreshHandler";
import ProtectedRoute from "./ProtectedRoute";

import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import ForgetPassword from "./pages/forgetpassowrd/forgetpassword";
import VerifiedOtp from "./verifiedOtp/verifiedOtp";
import About from "./pages/about/about";
import Home from "./pages/home/home";
import LoginSignupWrapper from "./LoginSignupWrapper/LoginSignupWrapper";

import AdminDashboard from "./admin/admindashboard/adminDashboard";
import RequestUsers from "./admin/requestUsers/requestUsers";
import Announcements from "./admin/Announcements/Announcements";
// import AdviserSlots from "./admin/adviser/adviserSlots";
import AddTeacher from "./admin/addTeacher/AddTeacher";
import ProjectIdea from "./admin/projectidea/projectIdea";
import ResourceFiles from "./admin/ResourceFile/ResouceFiles";
import AddCourse from "./admin/Course/AddCourse";
import ViewCourses from "./admin/Course/ViewCourses";

import Result from "./teacher/result";
import TeacherSlots from "./teacher/teacherSlot";
import SlotRequests from "./teacher/slotRequest/slotRequests";
import TeacherFypApprovals from "./teacher/TeacherFypApprovals";

import AdviserAvailiblity from "./pages/adviser/AdviserAvailiblity";
import AdvisorDetails from "./pages/advisorDetails/advisorDetails";
import DataSet from "./pages/datasets/dataSet";
import FYPResult from "./pages/result/fypresult";
import OPenProjectIdea from "./pages/projectIdea/openProjectIdea";
import ResourceFile from "./pages/resourceFile/resourceFiles";
import AdviserRequests from "./pages/adviser/AdviserRequest/AdviserRequests";
import UserDashboard from "./pages/userdashboard/userdashboard";
import AvailableCourses from "./pages/EmployeeCourse/AvailableCourses";
import CourseDetail from "./pages/EmployeeCourse/CourseDetail";
import EmployeeProgressGraph from "./Component/EmployeeProgressGraph/EmployeeProgressGraph";

function App() {
  return (
    <>
      <RefreshHandler />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<ProtectedRoute element={<Login />} />} />
        <Route path="/signup" element={<ProtectedRoute element={<Signup />}/>} />
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute element={<UserDashboard />} allowedRole="user" />
          }
        />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute element={<AdminDashboard />} allowedRole="admin" />
          }
        />
        <Route
          path="/request-users"
          element={
            <ProtectedRoute element={<RequestUsers />} allowedRole="admin" />
          }
        />
        <Route
          path="/noticeboard"
          element={
            <ProtectedRoute element={<Announcements />} allowedRole="admin" />
          }
        />
        <Route
          path="/admin/add-course"
          element= {<ProtectedRoute element={<AddCourse />} allowedRole="admin" />}
        />
        <Route
          path="/admin/view-courses"
          element={<ProtectedRoute element={<ViewCourses />} allowedRole="admin" />}
        />
        <Route 
          path = "/courses" element={<ProtectedRoute element={<AvailableCourses />} allowedRole="user" />}
        />
        <Route
          path="/myCourses" element={<ProtectedRoute element={<CourseDetail />} allowedRole="user" />} 
        />
        <Route
          path="/adviserAvailibilty"
          element={
            <ProtectedRoute element={<AdviserAvailiblity />} allowedRole="user" />
          }/>

        <Route
          path="/advisordetails"
          element={
            <ProtectedRoute element={<AdvisorDetails />} allowedRole="user" />
          }
        />
        <Route
          path="/certificates"
          element={<ProtectedRoute element={<DataSet />} allowedRole="user" />}
        />
        <Route
          path="/fypresult"
          element={<ProtectedRoute element={<FYPResult />} allowedRole="user" />}
          />
        <Route
          path="/adviser_requests"
          element={
            <ProtectedRoute element={<AdviserRequests />} allowedRole="user" />
          }
        />
        <Route
          path="/open-ideas"
          element={
            <ProtectedRoute element={<OPenProjectIdea />} allowedRole="user" />
          } 
        />
        <Route
          path="/resource-file"
          element={
            <ProtectedRoute element={<ResourceFile />} allowedRole="user" />
          }
        />
        <Route
          path="/employee-progress"
          element={
            <ProtectedRoute
              element={<EmployeeProgressGraph />}
              allowedRole="admin"
            />
          }
        />
        <Route
          path="/adviser_requests"
          element={
            <ProtectedRoute element={<AdviserRequests />} allowedRole="user" />
          }
        />
        <Route
          path="/forgetpassword"
          element={<ProtectedRoute element={<ForgetPassword />} />}
        />
        <Route
        path="/resetpassword"
        element={<ProtectedRoute element={<ForgetPassword />} />}
        />
        <Route
          path="/about"
          element={<ProtectedRoute element={<About />} />}
        />
        <Route
          path="/verifiedotp"
          element={<ProtectedRoute element={<VerifiedOtp />} />}
        />
        <Route
          path="/teacherDashboard"
          element={
            <ProtectedRoute element={<AdminDashboard />} allowedRole="teacher" />
          }
        />
        <Route
          path="/teacherslot"
          element={
            <ProtectedRoute element={<TeacherSlots />} allowedRole="teacher" />
          }
        />
        <Route
          path="/slotRequests"
          element={
            <ProtectedRoute element={<SlotRequests />} allowedRole="teacher" />
          }
        />
        <Route
          path="/submittedfyp"
          element={
            <ProtectedRoute
              element={<TeacherFypApprovals />}
              allowedRole="teacher"
            />
          }
        />
        <Route
          path="/result"
          element={<ProtectedRoute element={<Result />} allowedRole="admin" />} />
        <Route
          path="/addTeacher"
          element={<ProtectedRoute element={<AddTeacher />} allowedRole="admin" />}
        />
        <Route
          path="/projectIdea"
          element={<ProtectedRoute element={<ProjectIdea />} allowedRole="admin" />}
        />
        <Route
          path="/resourceFile"
          element={<ProtectedRoute element={<ResourceFiles />} allowedRole="admin" />}
        />
        <Route
          path="/loginwrapper"
          element={<ProtectedRoute element={<LoginSignupWrapper />} />}
        />
        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />


      </Routes>
    </>
  );
}

export default App;

