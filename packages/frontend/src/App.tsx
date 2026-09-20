import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flex, Spin } from "antd";
import { projectsApi } from "./api";
import { clearToken, getToken } from "./auth";
import AdminLayout from "./components/Admin/AdminLayout";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Password from "./components/Password/Password";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Management from "./components/Management/Management";
import ManageProjects from "./components/Management/components/ManageProjects/ManageProjects";
import type { Project } from "./types/Project";

function App() {
  const [authenticated, setAuthenticated] = useState(() => getToken() !== null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectsApi
      .get<Project[]>("/projects")
      .then((response) => {
        setProjects(
          [...response.data].sort(
            (a, b) =>
              a.projectIndex - b.projectIndex ||
              a.projectName.localeCompare(b.projectName),
          ),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const signOut = () => {
    clearToken();
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main projects={projects} />} />
        <Route
          path="login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />
        <Route path="password" element={<Password />} />
        <Route
          element={
            <ProtectedRoute authenticated={authenticated}>
              <AdminLayout onSignOut={signOut} />
            </ProtectedRoute>
          }
        >
          <Route path="management" element={<Management projects={projects} />} />
          <Route path="add-project" element={<ManageProjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
