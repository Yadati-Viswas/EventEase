import React from 'react';
import Navbar from './Navbar';
import Body from './Body';
import Footer from './Footer';

function Home() {
  return (
    <div className="font-sans flex flex-col">
      <Navbar />
        <Body />
      <Footer />
    </div>
  );
}

export default Home;