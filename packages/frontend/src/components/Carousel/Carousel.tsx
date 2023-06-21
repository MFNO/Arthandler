import { useEffect, useState } from "react";
import axios from "axios";
import "./Carousel.css";
import { Photo } from "../../types/Photo";
import type {
  CarouselItem,
  CarouselOptions,
  CarouselInterface,
} from "flowbite";
import { Carousel } from "flowbite";
import Line from "../Line/Line";
import { Project } from "../../types/Project";

type CarouselWrapperProps = {
  project: Project;
}

function CarouselWrapper(props: CarouselWrapperProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [photos, setPhotos] = useState<Array<Photo>>([]);

  const [carousel, setCarousel] = useState<CarouselInterface>();

  const [loading, setLoading] = useState(true);

  const prev = () => {
    if (!carousel) return;
    let index;
    if (selectedIndex === 0) {
      index = photos.length - 1;
    } else {
      index = selectedIndex - 1;
    }
    carousel.slideTo(index);
    setSelectedIndex(index);
    setScroll(index);
  };

  const next = () => {
    if (!carousel) return;
    let index;
    if (selectedIndex === photos.length - 1) {
      index = 0;
    } else {
      index = selectedIndex + 1;
    }
    carousel.slideTo(index);
    setSelectedIndex(index);
    setScroll(index);
  };

  const setScroll = (index: number) => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const scroll = document.getElementById("scroll-container");
    const selectedImage = document.getElementById(`scroll-image-${index}`);
    if (scroll && selectedImage) {
      scroll.scroll({
        top: 0,
        left: selectedImage.offsetLeft - (vw + -selectedImage.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/projects/${props.project.projectId}/photos`)
      .then((response) => {
        setPhotos(response.data.Photos);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.project.projectId]);

  useEffect(() => {
    setSelectedIndex(0);
    if (photos.length <= 0) return;
    let carouselItems = photos.flatMap<CarouselItem>((image, index) => {
      const element = document.getElementById(`carousel-item-${index}`);
      if (image && element) {
        return { position: index, el: element };
      }
      return [];
    });
    const options: CarouselOptions = {
      defaultPosition: 0
    }
    setCarousel(new Carousel(carouselItems, options));
  }, [photos, props.project.projectId]);

  const setCarouselItem = (index: number) => {
    if (!carousel) return;
    carousel.slideTo(index);
    setSelectedIndex(index);
    setScroll(index);
  };

  if (loading) return <></>;

  return (
    <>
      <div
        id="default-carousel"
        className="relative w-full carousel mb-8"
        data-carousel="static"
      >
        <div className="relative h-[34rem] overflow-hidden rounded-lg">
          {photos.map((item, index) => (
            <div
              id={`carousel-item-${index}`}
              key={index}
              className="hidden duration-700 ease-in-out"
              data-carousel-item
            >
              <img
                src={item.url}
                className="absolute block min-w-[1px] max-w-full max-h-[550px] min-h-[1px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => prev()}
          type="button"
          className="absolute hidden md:flex top-0 left-0 z-30 items-center justify-center h-full px-4 cursor-pointer group"
        >
          <span className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-black/30 dark:bg-gray-800/30">
            <svg
              aria-hidden="true"
              className="text-black w-6 h-6 dark:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          onClick={() => next()}
          type="button"
          className="absolute hidden top-0 right-0 z-30 md:flex items-center justify-center h-full px-4 cursor-pointer"
        >
          <span className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-black/30 dark:bg-gray-800/30">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-black sm:w-6 sm:h-6 dark:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
      <Line></Line>
      <div
        id="scroll-container"
        className="scroll-smooth noscroll whitespace-nowrap overflow-y-hidden overflow-x-scroll"
      >
        {photos.map((item, index) => (
          <img
            id={`scroll-image-${index}`}
            key={index}
            onClick={() => setCarouselItem(index)}
            src={item.url}
            className={`${index === selectedIndex ? "opacity-50" : ""
              } inline-block mx-1 h-24 cursor-pointer`}
          />
        ))}
      </div>
    </>
  );
}

export default CarouselWrapper;
