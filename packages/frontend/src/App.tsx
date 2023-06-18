import './App.css'
import Carousel from './components/Carousel/Carousel'
import Footer from './components/Footer/Footer'
import Navigation from './components/Navigation/Navigation'
import Title from './components/Title/Title'

function App() {
  return (
    <div className='flex flex-col items-center gap-y-8'>
      <Title></Title>
      <Navigation></Navigation>
      <Carousel></Carousel>
      <Footer></Footer>
    </div>
  )
}

export default App
