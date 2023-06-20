import "./App.css";
import CarouselWrapper from "./components/Carousel/Carousel";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Title from "./components/Title/Title";
import Line from "./components/Line/Line";

function App() {
  return (
    <div className="font-['Open_Sans'] flex flex-col items-center">
      <Title></Title>
      <Navigation></Navigation>
      <CarouselWrapper></CarouselWrapper>
      <Footer></Footer>
    </div>
  );
}

export default App;
