import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero3D from './components/Hero3D'
import AboutMe from './components/AboutMe'
import Services from './components/Services'
import Contact from './components/Contact' // ← ADAUGĂ
import Footer from './components/Footer'
import Admin from './pages/Admin'
import VideoPractice from './components/VideoPractice' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <Header />
            <Hero3D />
            <AboutMe />
            <Services />
            <Contact /> {/* ← ADAUGĂ */}
             <VideoPractice /> 
            <Footer />
          </div>
        } />
        
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App