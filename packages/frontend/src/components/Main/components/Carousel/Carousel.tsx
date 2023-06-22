import { useEffect, useState } from "react";
import axios from "axios";
import "./Carousel.css";
import { Photo } from "../../../../types/Photo";
import type {
  CarouselItem,
  CarouselOptions,
  CarouselInterface,
} from "flowbite";
import { Carousel } from "flowbite";
import Line from "../Line/Line";
import { Project } from "../../../../types/Project";

type CarouselWrapperProps = {
  project: Project;
};

function CarouselWrapper(props: CarouselWrapperProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [photos, setPhotos] = useState<Array<Photo>>([]);

  const [carousel, setCarousel] = useState<CarouselInterface>();

  const [loading, setLoading] = useState(true);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const prev = () => {
    if (!carousel) return;
    let index;
    if (selectedIndex === 0) {
      index = photos.length - 1;
    } else {
      index = selectedIndex - 1;
    }
    updateCarouselState(index);
  };

  const next = () => {
    if (!carousel) return;
    let index;
    if (selectedIndex === photos.length - 1) {
      index = 0;
    } else {
      index = selectedIndex + 1;
    }
    updateCarouselState(index);
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
      .get(
        `${import.meta.env.VITE_APP_API_URL}/projects/${
          props.project.projectId
        }/photos`
      )
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
      defaultPosition: 0,
    };
    setCarousel(new Carousel(carouselItems, options));
  }, [photos, props.project.projectId]);

  const setCarouselItem = async (index: number) => {
    if (!carousel) return;
    setScroll(index);
    setSelectedIndex(index);

    if (selectedIndex < index) {
      for (let x = selectedIndex; x <= index; x++) {
        if (x !== selectedIndex) await delay(200);
        carousel.slideTo(x);
      }
    }
    if (selectedIndex > index) {
      for (let x = selectedIndex; x >= index; x--) {
        if (x !== selectedIndex) await delay(200);
        carousel.slideTo(x);
      }
    }
  };

  const updateCarouselState = (index: number) => {
    carousel.slideTo(index);
    setSelectedIndex(index);
    setScroll(index);
  };

  if (loading)
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  if (!photos || !props.project) return <></>;

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
              className="hidden duration-500 ease-in-out"
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
            className={`${
              index === selectedIndex ? "opacity-50" : ""
            } inline-block mx-1 h-24 cursor-pointer`}
          />
        ))}
      </div>
    </>
  );
}

export default CarouselWrapper;
