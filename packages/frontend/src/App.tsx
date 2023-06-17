import './App.css'
import Carousel from './components/Carousel/Carousel'
import Footer from './components/Footer/Footer'
import Navigation from './components/Navigation/Navigation'
import PhotoScroller from './components/PhotoScroller/PhotoScroller'
import Title from './components/Title/Title'

function App() {
  console.log(import.meta.env.VITE_APP_API_URL)
  return (
    <div className='grid grid-flow-row auto-rows-max justify-center'>
      <Title></Title>
      <Navigation></Navigation>
      <Carousel></Carousel>
      <PhotoScroller></PhotoScroller>
      <Footer></Footer>
    </div>
  )
}

export default App
