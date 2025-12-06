import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero3D from "./components/Hero3D";
// import ParallaxBackground from './components/ParallaxBackground';
import Admin from "./pages/Admin"; // ← SCHIMBAT aici!

// Lazy loading pentru componente grele
const Services = lazy(() => import("./components/Services"));
const AboutMe = lazy(() => import("./components/AboutMe"));
const VideoPractice = lazy(() => import("./components/VideoPractice"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen relative">
              {/* <ParallaxBackground /> */}
              <Header />
              <Hero3D />

              {/* Suspense pentru componente lazy-loaded */}
              <Suspense fallback={<LoadingSpinner />}>
                <AboutMe />
                <Services />
                <VideoPractice />
                <Contact />
                <Footer />
              </Suspense>
            </div>
          }
        />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
