// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Volunteer from './pages/Volunteer';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import DonateSuccess from './pages/DonateSuccess';
import DonateCancel from './pages/DonateCancel';
import Blog from './pages/Blog';



export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-bg font-body text-neutral900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/donate/success" element={<DonateSuccess />} />
            <Route path="/donate/cancel" element={<DonateCancel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
