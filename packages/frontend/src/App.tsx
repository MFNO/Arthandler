import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flex, Spin } from "antd";
import { projectsApi } from "./api";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Password from "./components/Password/Password";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Management from "./components/Management/Management";
import ManageProjects from "./components/Management/components/ManageProjects/ManageProjects";
import type { Project } from "./types/Project";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectsApi
      .get<Project[]>("/projects")
      .then((response) => {
        setProjects(
          [...response.data].sort((a, b) => a.projectIndex - b.projectIndex),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          path="management"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Management projects={projects} />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-project"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <ManageProjects />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
