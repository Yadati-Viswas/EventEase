import Logo from '../assets/Ems_logo.png';
import { useAuth, useAuthNavigate } from '../contexts/AuthContext.jsx';
import {UserIcon} from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { myEventsApi,logoutApi, allEventsApi } from './api/eventApi.js';

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuthNavigate();
  const navigate = useNavigate();
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
    }
    else {
      alert(response.message);
    }
    logout();
  };
  const getAllEvents = async () => { 
    const allEventResponse = await allEventsApi();
    const allEvents = allEventResponse.data.data;
    navigate("/events/allEvents", { state: { allEvents} });
};
  return (
    <nav className="bg-gray-800 text-white p-8 flex justify-between items-center">
    <div className="text-lg font-bold"><Link to="/"><img src={Logo} alt="Event Management System" class="w-20 h-20"></img></Link></div>
    <div className='flex items-center space-x-4'>
      {isAuthenticated && user ? (
        <div className="flex items-center space-x-4">
          <Popover className="relative">
            <PopoverButton >
              <UserIcon className="h-5 w-5 cursor-pointer" />
              <span>{user.lastName}</span>
            </PopoverButton>
            <PopoverPanel  transition  anchor="bottom" className="flex flex-col w-36 h-26 divide-y divide-white rounded-xl bg-gray-600">
              <Link to="/users/profile" className="text-white pl-12 hover:text-gray-300 cursor-pointer">Profile</Link>
              <Link to="/users/registeredEvents" className="text-white pl-3 hover:text-gray-300 cursor-pointer">Registered Events</Link>
              <button onClick={getMyEvents} className="text-white hover:text-gray-300 cursor-pointer">My Events</button>
              <button onClick={Logout} className="text-white hover:text-gray-300 cursor-pointer">Logout</button>
            </PopoverPanel>
          </Popover>
          {location.pathname !== "/" && (
            <button onClick={getAllEvents} className="hover:text-gray-300 cursor-pointer">All Events</button>
          )}
          <Link to="/events/newEvent" className="hover:text-gray-300 cursor-pointer">New Event</Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/users/login" className="hover:text-gray-300">Login</Link>
          <Link to="/users/signup" className="hover:text-gray-300">SignUp</Link>
        </div>
      )
      }
      <div className="space-x-4">
        <Link to="/about" className="hover:text-gray-300">About</Link>
        <Link to="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;