import React, { useState} from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useEvents } from "../../contexts/EventsContext";
import { RegisterEvent, UnregisterEvent } from "../../utils/eventRegisterHandlers";
import { registerEventApi, UnregisterEventApi, sendRsvpApi, getRsvpCountApi } from '../api/eventApi';

export default function ShowEventDetails() {
    const location = useLocation();
    const { event, rsvpCount: initialRsvpCount } = location.state || {};
    const [rsvpCount, setRsvpCount] = useState(initialRsvpCount || 0);
    const {registeredEvents, setRegisteredEvents} = useEvents();
    
    const { isAuthenticated } = useAuth();
    const sendRsvp = async (eventId, rsvp, e) => {
        e.preventDefault();
        try {
          const response = await sendRsvpApi(eventId, rsvp);
          if (response.status === 200) {
            const response1 = await getRsvpCountApi(eventId);
            if (response1.status === 200 || response1.status === 304) {
                setRsvpCount(response1.data.data.countRsvp);
            }
            alert("RSVP Updated!");
          } else {
            alert("Failed to update RSVP.");
          }
        } catch (error) {
          console.error("Error sending RSVP:", error);
          alert("An error occurred while sending RSVP.");
        }
    };
    
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
          <div className='bg-white p-8 rounded shadow'>
            <h2 className="text-xl font-bold mb-3 hover:underline"> {event.event} </h2>
            {registeredEvents.some(e => e._id === event._id) ? (
              <Stack direction="row" marginBottom={1} spacing={1}>
                 <h2 className="mb-2"><strong>RSVP Event:</strong></h2>
                 <Button variant="contained" color="primary" size="small" onClick={(e) => sendRsvp(event._id,{rsvp:"Yes"}, e)}>Yes</Button>
                 <Button variant="outlined" color="error" size="small" onClick={(e) => sendRsvp(event._id,{rsvp:"No"}, e)}>No</Button>
              </Stack>): null }
            <div className="flex text-black">
              <div>
                <img src={event.image} alt={event.event} className="w-48 h-48 mt-2 rounded" />
              </div>
              <div className="ml-4 mt-4">
                <p><strong>Organizer:</strong> {event.organizer}</p>
                <p><strong>No. Of Users Registered:</strong> {event.registeredUsers.length}</p>
                <p><strong>Place:</strong> {event.place}</p>
                <p><strong>Start Date:</strong> {event.startDateFormatted}</p>
                <p><strong>End Date:</strong> {event.endDateFormatted}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>No. of Rsvp's:</strong> {rsvpCount}</p>
              </div>
              <div className="flex items-center ml-4">
                { isAuthenticated ? (
                <div className="ml-4 flex mt-4">
                    {registeredEvents.some(e => e._id === event._id) ? (
                    <div>
                        <Stack direction="column" marginBottom={1} spacing={1}>
                        <span className="text-green-500 mr-2">Registered ✔</span>
                        <button onClick={(e) => UnregisterEvent(event, setRegisteredEvents, UnregisterEventApi, isAuthenticated, e)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                        Unregister
                        </button>
                        </Stack>
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
        </div>
    <Footer />
    </div>
  );
}