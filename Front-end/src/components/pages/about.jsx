import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 bg-[#dcdcdc]">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">About EventEase</h1>
          <p className="mb-4 text-black">
            EventEase is a premier event management system designed to connect event organizers with attendees. We provide an intuitive and powerful platform to plan, promote, and manage events of all sizes.
          </p>
          <p className="mb-4 text-black">
            Our mission is to simplify the event experience by offering tools that help manage every aspect—from ticketing and scheduling to live updates and analytics.
          </p>
          <p className="text-black">
            Whether you’re hosting a large conference, a local meetup, or a virtual seminar, EventEase is here to ensure your event is a success.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default About;