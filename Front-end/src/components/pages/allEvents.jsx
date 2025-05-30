import React, { useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { getRegisteredEventsApi, registerEventApi } from "../api/eventApi";

export default function AllEvents() {
  const location = useLocation();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const { allEvents } = location.state || {};
  useEffect(() => {
    const getRegisteredEvents = async () => {
      const response = await getRegisteredEventsApi();
      console.log("Registered Events Response:", response.data.data);
      if (response.status === 200 || response.status === 304) {
        setRegisteredEvents(response.data.data.map(event => event._id));
      } else {
        alert(response.message);
      }
  };
    getRegisteredEvents();
  }, []);
  const RegisterEvent = async (event, e) => {
    e.preventDefault();
    const eventId = event._id;
    console.log("Event ID:",eventId);
    const response = await registerEventApi(event, eventId);
    if (response.status === 200) {
      alert("Registered successfully!");
      setRegisteredEvents((prev) => [...prev, eventId]);
    } else {
      alert("Registration failed!");
    }
  };
  console.log("Registered Events:", registeredEvents);
  return (
    <div className="font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
        <div className='bg-white p-8 rounded shadow'>
        <h1 className="text-2xl font-bold mb-6 text-black text-center">All Events</h1>
        {allEvents.map((event) => (
          <div key={event._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-bold">{event.event}</h2>
            <div className="flex text-black">
              <div>
                <img src={`data:image/jpeg;base64,${event.image}`} alt={event.event} className="w-48 h-48 mt-2 rounded" />
              </div>
              <div className="ml-4 mt-4">
              <p><strong>Place:</strong> {event.place}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric", })}</p>
              <p><strong>Start Time:</strong> {event.startTime}</p>
              <p><strong>End Time:</strong> {event.endTime}</p>
              <p><strong>Description:</strong> {event.description}</p>
              </div>
            </div>
            <div className="mt-4 flex mb-4">
              {registeredEvents.includes(event._id) ? (
              <button disabled className="bg-green-600 text-white px-4 py-2 rounded"> Registered </button>
              ) : (
              <button onClick={(e) => RegisterEvent(event, e)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Register Now
              </button>
              )}
            </div>
          </div>
        ))
        }
      </div>
      </div>
      <Footer />
    </div>
  );
}