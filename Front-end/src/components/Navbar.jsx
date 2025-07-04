import React, { useState } from 'react';
import Logo from '../assets/Ems_logo.png';
import { useAuth, useAuthNavigate } from '../contexts/AuthContext.jsx';
import { UserIcon } from '@heroicons/react/20/solid';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { myEventsApi, logoutApi, allEventsApi } from './api/eventApi.js';

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuthNavigate();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const getMyEvents = async () => {
    const response = await myEventsApi();
    if (response.status === 200) {
      navigate('/users/myEvents', { state: { myEvents: response.data.data } });
    } else {
      alert(response.message);
    }
  };
  const Logout = async () => {
    const response = await logoutApi();
    if (response.status === 200) {
      alert('User logged out');
      navigate('/');
    } else {
      alert(response.message);
    }
    logout();
  };
  const getAllEvents = async () => {
    const allEventResponse = await allEventsApi();
    const allEvents = allEventResponse.data.data;
    navigate("/events/allEvents", { state: { allEvents } });
  };

  return (
    <nav className="bg-[#242424d9] text-white p-3 md:p-5 flex flex-col md:flex-row justify-between items-center rounded border-2 border-gray-300 relative">
      {/* Logo and Hamburger */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/">
          <img src={Logo} alt="Event Management System" className="w-16 h-16 md:w-20 md:h-20" />
        </Link>
        {/* Hamburger button for mobile */}
        <button className="md:hidden text-white focus:outline-none cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" >
          <svg className="w-8 h-8 hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Menu links */}
      <div className={`flex-col md:flex-row md:flex items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0 transition-all duration-500 ease-out ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
        {isAuthenticated && user ? (
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <Popover className="relative hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out cursor-pointer">
              <PopoverButton className="flex items-center space-x-1">
                <UserIcon className="h-5 w-5 cursor-pointer" />
                <span>{user.lastName}</span>
              </PopoverButton>
              <PopoverPanel transition anchor="bottom" className="flex flex-col w-36 h-26 divide-y divide-white rounded-xl bg-[#242424d9] z-50">
                <Link to="/users/profile" className="text-white pl-12 hover:text-gray-300 cursor-pointer" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>Profile</Link>
                <Link to="/users/registeredEvents" className="text-white pl-3 hover:text-gray-300 cursor-pointer">Registered Events</Link>
                <button onClick={getMyEvents} className="text-white hover:text-gray-300 cursor-pointer">My Events</button>
                <button onClick={Logout} className="text-white hover:text-gray-300 cursor-pointer">Logout</button>
              </PopoverPanel>
            </Popover>
            {location.pathname !== "/" && (
              <button onClick={getAllEvents} className="hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out cursor-pointer">All Events</button>
            )}
            <Link to="/events/newEvent" className="hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out">New Event</Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <Link to="/users/login" className="hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out">Login</Link>
            <Link to="/users/signup" className="hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out">SignUp</Link>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <Link to="/about" className="hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out">About</Link>
          <Link to="/contact" className="hover:bg-white focus:bg-white hover:text-[#333] focus:text-[#333] px-2 py-1 rounded transition-all duration-500 ease-out">Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;