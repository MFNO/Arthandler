import './App.css'
import Carousel from './components/Carousel/Carousel'
import Footer from './components/Footer/Footer'
import Navigation from './components/Navigation/Navigation'
import PhotoScroller from './components/PhotoScroller/PhotoScroller'
import Title from './components/Title/Title'

function App() {
  return (
    <div className='flex flex-col items-center'>
      <Title></Title>
      <Navigation></Navigation>
      <Carousel></Carousel>
      <PhotoScroller></PhotoScroller>
      <Footer></Footer>
    </div>
  )
}

export default App
