import { useEffect, useState } from "react";
import "./App.css";
import CarouselWrapper from "./components/Carousel/Carousel";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Title from "./components/Title/Title";
import axios from "axios";
import { Project } from "./types/Project";

function App() {
  const [projects, setProjects] = useState<Array<Project>>([]);

  const [selectedProject, setSelectedProject] = useState<Project>();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_API_URL + "/projects")
      .then((response) => {
        console.log(response)
        setProjects(response.data);
        setSelectedProject(response.data[0])
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  if (!selectedProject || !projects) return <></>
  return (
    <div className="font-['Open_Sans'] flex flex-col items-center">
      <Title></Title>
      <Navigation projects={projects} setSelectedProject={setSelectedProject} ></Navigation>
      <CarouselWrapper project={selectedProject}></CarouselWrapper>
      <Footer></Footer>
    </div>
  )
}

export default App;
