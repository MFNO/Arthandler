import "./App.css";
import CarouselWrapper from "./components/Carousel/Carousel";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Title from "./components/Title/Title";
import Line from "./components/Line/Line";

function App() {
  return (
    <div className="flex flex-col items-center gap-y-8">
      <Title></Title>
      <Navigation></Navigation>
      <CarouselWrapper></CarouselWrapper>
      <Line></Line>
      <Footer></Footer>
    </div>
  );
}

export default App;
