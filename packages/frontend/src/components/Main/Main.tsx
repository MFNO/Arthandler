import { useEffect, useState } from "react";
import "./Main.css";
import CarouselWrapper from "./components/Carousel/Carousel";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Title from "./components/Title/Title";
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
        <>
            <Title></Title>
            <Navigation selectedProject={selectedProject} projects={projects} setSelectedProject={setSelectedProject} ></Navigation>
            <CarouselWrapper project={selectedProject}></CarouselWrapper>
            <Footer></Footer>
        </>
    )
}

export default Main;
