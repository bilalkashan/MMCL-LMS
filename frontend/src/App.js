import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import ForgetPassword from "./pages/forgetpassowrd/forgetpassword";
import RefreshHandler from "./RefreshHandler";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./admin/admindashboard/adminDashboard";
import About from "./pages/about/about";
import AdviserSlots from "./admin/adviser/adviserSlots";
import AdviserAvailiblity from "./pages/adviser/AdviserAvailiblity";
import DataSet from "./pages/datasets/dataSet";
import AdvisorDetails from "./pages/advisorDetails/advisorDetails";
import RequestUsers from "./admin/requestUsers/requestUsers";
import Announcements from "./admin/Announcements/Announcements";
import VerifiedOtp from "./verifiedOtp/verifiedOtp";
import ProtectedRoute from "./ProtectedRoute";
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
import CourseList from "./pages/CourseList/CourseList";
import QuizPage from "./pages/QuizPage/QuizPage";
import CertificatePage from "./pages/CertificatePage/CertificatePage";
import AdminCourses from "./admin/AdminCourses/AdminCourses";
import CourseDetail from "./pages/CourseList/CourseDetail"; 


function App() {
  return (
    <div className="App">
      <RefreshHandler />
      <ToastContainer />
      <Routes>
        <Route path="/loginwrapper" element={<LoginSignupWrapper />} />
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/signup"
          element={<ProtectedRoute element={<Signup />} />}
        />
        <Route path="/login" element={<ProtectedRoute element={<Login />} />} />
        <Route
          path="/forgetpassword"
          element={<ProtectedRoute element={<ForgetPassword />} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/verifiedotp" element={<VerifiedOtp />} />
        {/* User Routes */}
        <Route
          path="/home"
          element={<ProtectedRoute element={<Home />} allowedRole="user" />}
        />
        <Route
          path="/adviserAvailibilty"
          element={
            <ProtectedRoute
              element={<AdviserAvailiblity />}
              allowedRole="user"
            />
          }
        />
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
          element={
            <ProtectedRoute element={<FYPResult />} allowedRole="user" />
          }
        />
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute element={<UserDashboard />} allowedRole="user" />
          }
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
            <ProtectedRoute element={<EmployeeProgressGraph />} allowedRole="admin" />
          }
        />
        {/* Admin Routes */}
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
          path="/adviserslist"
          element={
            <ProtectedRoute element={<AdviserSlots />} allowedRole="admin" />
          }
        />
        <Route
          path="/result"
          element={<ProtectedRoute element={<Result />} allowedRole="admin" />}
        />
        <Route
          path="/addTeacher"
          element={
            <ProtectedRoute element={<AddTeacher />} allowedRole="admin" />
          }
        />
        <Route
          path="/projectIdea"
          element={
            <ProtectedRoute element={<ProjectIdea />} allowedRole="admin" />
          }
        />
        {/* Teacher Routes */}
        <Route
          path="/teacherDashboard"
          element={
            <ProtectedRoute
              element={<AdminDashboard allowedRole="user" />}
            />
          }
        />
        <Route
          path="/teacherslot"
          element={
            <ProtectedRoute element={<TeacherSlots />} allowedRole="user" />
          }
        />
        <Route
          path="/slotRequests"
          element={
            <ProtectedRoute element={<SlotRequests />} allowedRole="user" />
          }
        />
        =
        <Route
          path="/resourceFile"
          element={
            <ProtectedRoute element={<ResourceFiles />} allowedRole="admin" />
          }
        />
        <Route
          path="/submittedfyp"
          element={
            <ProtectedRoute
              element={<TeacherFypApprovals />}
              allowedRole="user"
            />
          }
        />

        <Route path="/admin/courses"
          element={
            <ProtectedRoute
              element={<AdminCourses />}
              allowedRole="admin"
            />
          } 
        />

        <Route path="/courses"
          element={
            <ProtectedRoute
              element={<CourseList />}
              allowedRole="user"
            />
          } 
        />

        <Route path="/course/:id"
          element={
            <ProtectedRoute
              element={<CourseDetail />}
              allowedRole="user"
            />
          } 
        />

        <Route path="/quiz/:id"
          element={
            <ProtectedRoute
              element={<QuizPage />}
              allowedRole="user"
            />
          } 
        />

        <Route path="/certificate/:id"
          element={
            <ProtectedRoute
              element={<CertificatePage />}
              allowedRole="user"
            />
          } 
        />

      </Routes>
    </div>
  );
}

export default App;



