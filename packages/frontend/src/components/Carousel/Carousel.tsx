import React from "react";
import "./Carousel.css";
import { Photo } from "../../types/Photo";
import type {
  CarouselItem,
  CarouselOptions,
  CarouselInterface,
} from "flowbite";
import { Carousel } from "flowbite";
function CarouselWrapper() {

  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const images: Photo[] = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/F-15_vertical_deploy.jpg", index: 0 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG/1920px-Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG", index: 1 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg/1920px-An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg", index: 2 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 3 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Thuringia_Schmalkalden_asv2020-07_img18_Schloss_Wilhelmsburg.jpg/1000px-Thuringia_Schmalkalden_asv2020-07_img18_Schloss_Wilhelmsburg.jpg", index: 4 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mermaid_Parade_%2860132%29.jpg/1024px-Mermaid_Parade_%2860132%29.jpg", index: 5 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/A_GOLDEN_SPIDER_USING_ITS_VERY_OWN_RAINBOW_TO_CATCH_PREY.jpg/1227px-A_GOLDEN_SPIDER_USING_ITS_VERY_OWN_RAINBOW_TO_CATCH_PREY.jpg", index: 6 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/DOUBLE_RAINBOW.tif/lossy-page1-1515px-DOUBLE_RAINBOW.tif.jpg", index: 7 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/F-15_vertical_deploy.jpg", index: 8 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG/1920px-Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG", index: 9 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg/1920px-An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg", index: 10 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 11 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 12 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 13 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 14 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 15 },
  ]

  const [carousel, setCarousel] = React.useState<CarouselInterface>();

  const prev = () => {
    if (!carousel) return;
    let index;
    if (selectedIndex === 0) {
      index = images.length - 1;
    } else {
      index = selectedIndex - 1;
    }
    carousel.slideTo(index);
    setSelectedIndex(index);
  };

  const next = () => {
    if (!carousel) return;
    let index;
    if (selectedIndex === images.length - 1) {
      index = 0;
    } else {
      index = selectedIndex + 1;
    }
    carousel.slideTo(index);
    setSelectedIndex(index);
    const scrollContainer = document.getElementById("#scroll-container");
  }


  React.useEffect(() => {
    let carouselItems = images.flatMap<CarouselItem>((image, index) => {
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
  }, []);

  const setCarouselItem = (index: number) => {
    if (!carousel) return;
    carousel.slideTo(index);
    setSelectedIndex(index);
  };

  return (
    <>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="static"
      >
        <div className="relative h-[34rem] overflow-hidden rounded-lg">
          {images.map((item, index) => (
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
        <button onClick={() => prev()} type="button" className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-black/30 dark:bg-gray-800/30 group-hover:bg-black/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-black dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg aria-hidden="true" className="w-5 h-5 text-black sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button onClick={() => next()} type="button" className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-black/30 dark:bg-gray-800/30 group-hover:bg-black/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-black dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg aria-hidden="true" className="w-5 h-5 text-black sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div >
      <div id="scroll-container" className='noscroll whitespace-nowrap overflow-y-hidden overflow-x-scroll'>
        {images.map((item, index) =>
          <div id={`image-scroll-${index}`} className='inline-block mx-1' >
            <img key={index} onClick={() => setCarouselItem(index)} src={item.url}
              className={`${index === selectedIndex && "opacity-50"} h-24`} />
          </div>
        )}
      </div>
    </>
  );
}

export default CarouselWrapper;
