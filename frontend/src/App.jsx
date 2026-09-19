//import './features/App.css'
import {createBrowserRouter, RouterProvider} from 'react-router'
import './features/section1.css'
import Footer from './shared/components/layout/FooterLanding/Footer'
import NavBarLanding from './shared/components/layout/NavBarLanding/NavBarLanding'
import ServiceSection from './features/home/ServiceCards/ServiceSection'
import Faq from './features/home/FAQ/Faq'
import Inicio from './features/home/Inicio/Inicio'
const router = createBrowserRouter([
  {path : '/' }
])

function App() {

  return (
    <>
      <NavBarLanding />


      <main>
        <Inicio />
        <ServiceSection />
        <Faq />
      </main >


      <Footer />
    </>
  )
}

export default App
