import { Link, useLocation, useRoutes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Register from "./pages/register/Register";
import TermForm from "./components/forms/TermForm";
import Login from "./components/login/Login";
import { useAuthContext } from "./context/useAuthContext";
import Faqs from "./pages/Faqs";
import FaqForm from "./components/forms/FaqForm";
import Exam from "./pages/Exam";
import ExamProject from "./pages/ExamProject";
import ProjectForm from "./components/forms/ProjectForm";
import Project from "./pages/project/Project";
import Exercises from "./pages/Exercises";
import ExerciseForm from "./components/forms/ExerciseForm";
import Backoffice from "./pages/Backoffice";
import Users from "./components/users/Users";
import Events from "./pages/Events";
import EventForm from "./components/forms/EventForm";
import Navigation from "./components/Navigation";
import ChangePassword from "./components/forms/ChangePassword";
import Teams from "./components/teams/Teams";
import TeamForm from "./components/forms/TeamForm";
import TeamUsersList from "./components/teams/TeamUsersList";
import StudentPanel from "./pages/StudentPanel";
import UserProfile from "./components/UserProfile";
import { useMemo } from "react";
import BackArrow from "./components/button/BackArrow";
import GroupGenerator from "./pages/GroupGenerator";
import ExamSchedule from "./pages/ExamSchedule";
import Team from "./pages/Team";
import TeacherPanel from "./pages/TeacherPanel";
import Materials from "./pages/Materials";
function App() {
  const { signedIn, user, signOut } = useAuthContext();
  const location = useLocation();

  const showBackArrow = useMemo(
    () => location.pathname !== "/" && location.pathname !== "/login",
    [location.pathname]
  );

  // 🔒 Protected wrapper shorthand
  const withProtection = (element, isAllowed = signedIn) => (
    <ProtectedRoute isAllowed={isAllowed}>{element}</ProtectedRoute>
  );

  const hostRoutes = [
    {
      path: "/login",
      element: <Login />,
    },
  ];

  // 👤 Default (student, teacher, admin)
  const defaultRoutes = [
    {
      path: "/",
      element: withProtection(<Home />),
      children: [
        {
          path: "projects",
          element: <Projects />,
          children: [
            { path: "add", element: <ProjectForm /> },
            { path: "edit/:id", element: <ProjectForm isEditMode={true} /> },
          ],
        },
        {
          path: "projects/:id",
          element: <Project />,
          children: [
            { path: "edit/:id", element: <ProjectForm isEditMode={true} /> },
          ],
        },
        {
          path: "exercises",
          element: <Exercises />,
          children: [
            { path: "add", element: <ExerciseForm /> },
            { path: "edit/:id", element: <ExerciseForm isEditMode={true} /> },
          ],
        },
        {
          path: "register",
          element: <Register />,
          children: [
            { path: "add", element: <TermForm /> },
            { path: "edit/:id", element: <TermForm isEditMode={true} /> },
          ],
        },
        {
          path: "faqs",
          element: <Faqs />,
          children: [
            { path: "add", element: <FaqForm /> },
            { path: "edit/:id", element: <FaqForm isEditMode={true} /> },
          ],
        },
        { path: "exam", element: <Exam /> },
        { path: "examproject", element: <ExamProject /> },
        {
          path: "events",
          element: <Events />,
          children: [
            { path: "add", element: <EventForm /> },
            { path: "edit/:id", element: <EventForm isEditMode={true} /> },
          ],
        },
        { path: "change-password", element: <ChangePassword /> },
        { path: "materials", element: <Materials /> },
        { path: "studentpanel/:userId", element: <StudentPanel /> },
        { path: "teacherpanel/:userId", element: <TeacherPanel /> },
        { path: "studentpanel/:userId/team/:id", element: <Team /> },
        { path: "teacherpanel/:userId/team/:id", element: <Team /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/backoffice",
      element: withProtection(
        <Backoffice />,
        user?.role === "teacher" || user?.role === "admin"
      ),
      children: [
        { path: "users", element: <Users /> },
        {
          path: "teams",
          element: <Teams />,
          children: [
            { path: "add", element: <TeamForm /> },
            { path: "edit/:id", element: <TeamForm isEditMode={true} /> },
            { path: "team/:teamId", element: <TeamUsersList /> },
            { path: "team/:id/groups", element: <GroupGenerator /> },
          ],
        },
        { path: "examSchedule", element: <ExamSchedule /> },
        {
          path: "events",
          element: <Events />,
          children: [
            { path: "add", element: <EventForm /> },
            { path: "edit/:id", element: <EventForm isEditMode={true} /> },
          ],
        },
        {
          path: "team/:id/user/:userId",
          element: <StudentPanel />,
        },
      ],
    },
    {
      path: "*",
      element: <div>404 - Not Found</div>,
    },
  ];

  const routes = useRoutes(user?.role === "host" ? hostRoutes : defaultRoutes);
  const isInvitationRoute = location.pathname.startsWith("/invitation");

  return (
    <article className='app'>
      {!isInvitationRoute && user?.role !== "host" && (
        <>
          {signedIn && <UserProfile signOut={signOut} user={user} />}
          <Link to='/'>
            <img src='/assets/mcdm_logo.png' alt='logo' className='logo' />
          </Link>
          <Navigation />
          {showBackArrow && <BackArrow />}
        </>
      )}
      <div className='main'>{routes}</div>
    </article>
  );
}

export default App;
