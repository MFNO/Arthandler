import { useState } from "react";
import { Layout } from "antd";
import CarouselWrapper from "./components/Carousel/Carousel";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Title from "./components/Title/Title";
import type { Project } from "../../types/Project";

type MainProps = {
  projects: Project[];
};

function Main({ projects }: MainProps) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    projects[0],
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content>
        <Title />
        <Navigation
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
        {selectedProject && (
          <CarouselWrapper
            key={selectedProject.projectId}
            project={selectedProject}
          />
        )}
      </Layout.Content>
      <Footer />
    </Layout>
  );
}

export default Main;
