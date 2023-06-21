import { useEffect, useState } from "react";
import "./Main.css";
import CarouselWrapper from "./Components/Carousel/Carousel";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/Navigation/Navigation";
import Title from "./Components/Title/Title";
import axios from "axios";
import { Project } from "../../types/Project";

function Main() {
    const [projects, setProjects] = useState<Array<Project>>([]);

    const [selectedProject, setSelectedProject] = useState<Project>();

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_API_URL + "/projects")
            .then((response) => {
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
            <Navigation selectedProject={selectedProject} projects={projects} setSelectedProject={setSelectedProject} ></Navigation>
            <CarouselWrapper project={selectedProject}></CarouselWrapper>
            <Footer></Footer>
        </div>
    )
}

export default Main;
