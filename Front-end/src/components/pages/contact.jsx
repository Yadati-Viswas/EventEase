import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-[#dcdcdc] overflow-scroll">
        <div className="w-full max-w-lg bg-gray-100 p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-black mb-2"> Name </label>
              <input id="name" type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Your Name"/>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black mb-2">
                Email
              </label>
              <input id="email" type="email" className="w-full p-2 border border-gray-300 rounded" placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-black mb-2"> Message</label>
              <textarea id="message" className="w-full p-2 border border-gray-300 rounded" placeholder="Your message..." rows="4"></textarea>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 cursor-pointer">
              Send Message </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;