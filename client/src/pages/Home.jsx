import Navbar from '../components/Navbar'
import React from 'react';
import Hero from '../components/Hero';
import ResourceCard from '../components/ResourceCard';
import Preparation from '../components/Preparation';
import Footer from '../components/Footer';
import PrepResources from '../components/PrepResources';
import { HomeResourcesProvider } from '../contexts/HomeResourcesContext';



const Home = () => {
  return (
    <>
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <PrepResources />
      <HomeResourcesProvider>
        <ResourceCard />
      </HomeResourcesProvider>

      <Preparation />
      <Footer />
    </div>
    </>
  )
}

export default Home