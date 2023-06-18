import React from 'react'
import './Carousel.css'
import { Photo } from '../../types/Photo'
import type { CarouselItem, CarouselOptions, CarouselInterface } from "flowbite";
import { Carousel } from "flowbite";
function CarouselWrapper() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)


  const images: Photo[] = [
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/F-15_vertical_deploy.jpg", index: 0 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG/1920px-Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG", index: 1 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg/1920px-An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg", index: 2 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 3 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/F-15_vertical_deploy.jpg", index: 4 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG/1920px-Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG", index: 5 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg/1920px-An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg", index: 6 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 7 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/F-15_vertical_deploy.jpg", index: 8 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG/1920px-Triceratops_Specimen_at_the_Houston_Museum_of_Natural_Science.JPG", index: 9 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg/1920px-An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg", index: 10 },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Priestley.jpg", index: 11 },
  ]


  React.useEffect(() => {
    let carouselItems = images.flatMap<CarouselItem>((_image, index) => {
      if (document.getElementById(`carousel-item-${index}`)) {
        return { position: index, el: document.getElementById(`carousel-item-${index}`) }
      }
    })

    const options: CarouselOptions = {
      defaultPosition: 1
    };

    const carousel: CarouselInterface = new Carousel(carouselItems, options);
    console.log(carousel)


  }, [])




  const test = async (item: Photo) => {
    if (item.index === selectedIndex) return;
    if (item.index < selectedIndex) {
      for (let x = 0; x < selectedIndex - item.index; x++) {
        await timeout(200)
      }
    }
    if (item.index > selectedIndex) {
      for (let x = 0; x < item.index - selectedIndex; x++) {
        await timeout(200)
      }
    }
    setSelectedIndex(item.index);
  }

  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }

  return (
    <>
      <div id="default-carousel" className="relative w-full" data-carousel="static">
        <div className="relative h-[34rem] overflow-hidden rounded-lg">
          {images.map((item, index) =>
            <div id={`carousel-item-${index}`} key={index} className="hidden duration-700 ease-in-out" data-carousel-item>
              <img src={item.url}
                className="absolute block min-w-[1px] max-w-full max-h-[550px] min-h-[1px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
            </div>
          )}
        </div>
        <button onClick={() => selectedIndex === 0 ? setSelectedIndex(images.length - 1) : setSelectedIndex(selectedIndex - 1)} type="button" className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg aria-hidden="true" className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button onClick={() => selectedIndex === images.length - 1 ? setSelectedIndex(0) : setSelectedIndex(selectedIndex + 1)} type="button" className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg aria-hidden="true" className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div >
      <div className='noscroll flex flex-row w-full max-w-[100%] overflow-y-hidden overflow-x-scroll'>
        {images.map((item, index) =>
          <img key={index} onClick={() => test(item)} src={item.url}
            className={`${index === selectedIndex && "opacity-50"} mx-2 block h-24`} />
        )}
      </div>
    </>
  )
}

export default CarouselWrapper
