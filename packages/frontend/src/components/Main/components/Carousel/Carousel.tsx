import { useEffect, useRef, useState } from "react";
import { Carousel, Divider, Flex, Spin } from "antd";
import { projectsApi } from "../../../../api";
import type { Photo } from "../../../../types/Photo";
import type { Project } from "../../../../types/Project";
import "./Carousel.css";

type CarouselWrapperProps = {
  project: Project;
};

function CarouselWrapper({ project }: CarouselWrapperProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<React.ComponentRef<typeof Carousel>>(null);

  useEffect(() => {
    projectsApi
      .get<{ Photos?: Photo[] }>(`/projects/${project.projectId}/photos`)
      .then((response) => setPhotos(response.data.Photos ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [project.projectId]);

  const onChange = (current: number) => {
    setSelectedIndex(current);
    document.getElementById(`thumbnail-${current}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  if (loading) {
    return (
      <Flex justify="center" style={{ padding: "6rem 0" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (photos.length === 0) return null;

  return (
    <>
      <Carousel
        ref={carouselRef}
        arrows
        infinite
        dots={false}
        afterChange={onChange}
        style={{ background: "#f7f7f7" }}
      >
        {photos.map((photo, index) => (
          <div key={index}>
            <Flex justify="center" align="center" style={{ height: "34rem" }}>
              <img
                src={photo.url}
                style={{ maxHeight: "550px", maxWidth: "100%" }}
              />
            </Flex>
          </div>
        ))}
      </Carousel>

      <Divider style={{ width: "75%", minWidth: "75%", margin: "23px auto 35px" }} />

      <div className="thumbnail-strip">
        {photos.map((photo, index) => (
          <img
            id={`thumbnail-${index}`}
            key={index}
            src={photo.url}
            onClick={() => carouselRef.current?.goTo(index)}
            style={{ opacity: index === selectedIndex ? 0.5 : 1 }}
          />
        ))}
      </div>
    </>
  );
}

export default CarouselWrapper;
