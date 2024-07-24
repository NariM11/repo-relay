import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { fetchUserAsync } from "./redux/user/userThunks";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import ProjectHubPage from "./pages/ProjectHubPage";
import PostProjectPage from "./pages/PostProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AboutUsPage from "./pages/AboutUsPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProfileCreationPage from "./pages/ProfileCreationPage";
import "./App.css";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

console.log(serverUrl);

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserAsync(token));
    }
  }, [dispatch]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [navigate]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      console.log("HELLO ", token);

      window.history.replaceState(null, null, window.location.pathname);
      navigate("/home");
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setIsAuthenticated(true);
      }
    }
  }, [navigate]);

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<Login />} />
      ) : (
        <>
          <Route index element={<ProjectHubPage />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/hub" element={<ProjectHubPage />} />
          <Route path="/post" element={<PostProjectPage />} />
          <Route
            path="/projectDetails/:projectId"
            element={<ProjectDetailsPage />}
          />
          <Route path="/aboutUs" element={<AboutUsPage />} />
          <Route path="/userProfile" element={<UserProfilePage />} />
          <Route path="/initProfile" element={<ProfileCreationPage />} />
        </>
      )}
    </Routes>
  );
}

export default App;
