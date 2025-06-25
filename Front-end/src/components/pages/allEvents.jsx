import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { getRegisteredEventsApi, registerEventApi, UnregisterEventApi, getRsvpCountApi } from "../api/eventApi";
import { useAuth } from "../../contexts/AuthContext";
import { useEvents } from "../../contexts/EventsContext";
import { RegisterEvent, UnregisterEvent } from "../../utils/eventRegisterHandlers";

export default function AllEvents() {
  const location = useLocation();
  const navigate = useNavigate();
  const { allEvents } = location.state || {};
  const {registeredEvents, setRegisteredEvents} = useEvents();
  const { isAuthenticated } = useAuth();
  const handleClick = async (event, e) => {
    e.preventDefault();
    try {
      const response = await getRsvpCountApi(event._id);
      if (response.status === 200 || response.status === 304) {
        const rsvpCount = response.data.data.countRsvp;
        navigate(`/events/ShowEventDetails`, { state: { event, rsvpCount } });
      } else {
        alert("Failed to fetch RSVP count.");
      }
    } catch (error) {
      console.error("Error fetching RSVP count:", error);
      alert("An error occurred while fetching RSVP count.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
        <div className='bg-white p-8 rounded shadow'>
        <h1 className="text-2xl font-bold mb-6 text-black text-center">All Events</h1>
        {allEvents.map((event) => (
          <div key={event._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-bold mb-3 hover:underline cursor-pointer" onClick={(e)=>handleClick(event,e)}>
              {event.event}
            </h2>
            <div className="flex text-black">
              <div>
                <img src={event.image} alt={event.event} className="w-16 h-16 mt-2 rounded" />
              </div>
              <div className="ml-4 mt-4">
                <p><strong>Organizer:</strong> {event.organizer}</p>
                <p><strong>No. Of Users Registered:</strong> {event.registeredUsers ? event.registeredUsers.length: 0}</p>
              </div>
              <div className="flex items-center">
                { isAuthenticated ? (
              <div className="ml-4 flex mt-4">
                {registeredEvents.includes(event._id) ? (
                  <div>
                    <span className="text-green-500 mr-2">Registered ✔</span>
                    <button onClick={(e) => UnregisterEvent(event, setRegisteredEvents, UnregisterEventApi, isAuthenticated, e)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                      Unregister
                    </button>
                  </div>
                ) : (
                <button onClick={(e) => RegisterEvent(event, setRegisteredEvents, registerEventApi, isAuthenticated, e)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                  Register Now
                </button>
                )}
              </div>
              ) : (
                  <Button onClick={(e)=> alert("Please login to register for the Event!")} className="text-red-500 mr-2">Please login to register</Button>
              )}
              </div>
          </div>
          </div>
        ))}
      </div>
      </div>
      <Footer />
    </div>
  );
}


