import { useState } from "react";
import "./Main.css";
import CarouselWrapper from "./components/Carousel/Carousel";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Title from "./components/Title/Title";
import { Project } from "../../types/Project";

type MainProps = {
  projects: Array<Project>;
};

function Main(props: MainProps) {
  const [selectedProject, setSelectedProject] = useState<Project>(
    props.projects[0]
  );

  return (
    <>
      <Title></Title>
      <Navigation
        selectedProject={selectedProject}
        projects={props.projects}
        setSelectedProject={setSelectedProject}
      ></Navigation>
      <CarouselWrapper project={selectedProject}></CarouselWrapper>
      <Footer></Footer>
    </>
  );
}

export default Main;
