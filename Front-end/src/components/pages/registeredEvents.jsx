import Footer from "../Footer";
import Navbar from "../Navbar";
import { useEffect,useState } from "react";
import { useEvents } from "../../contexts/EventsContext";

export default function RegisteredEvents() {
    const { registeredEvents, getRegisteredEvents } = useEvents();
    useEffect(() => {
        if (registeredEvents.length === 0) {
          getRegisteredEvents();
        }
      }, [getRegisteredEvents]);
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
                <div className='bg-white p-8 rounded shadow'>
                    <h2 className="text-2xl font-bold mb-6 text-black text-center">Registered Events</h2>
                    {registeredEvents.map((event) => (
                    <div key={event._id} className="p-4 mb-4 rounded shadow" style={{ border: "2px solid rgb(30, 31, 32)" }}>
                        <h2 className="text-xl font-bold">{event.event}</h2>
                        <div className="flex text-black">
                        <div>
                            <img src={event.image} alt={event.event} className="w-48 h-48 mt-2 rounded" />
                        </div>
                        <div className="ml-4 mt-4">
                            <p><strong>Place:</strong> {event.place}</p>
                            <p><strong>Start Date:</strong> {event.startDateFormatted}</p>
                            <p><strong>End Date:</strong> {event.endDateFormatted}</p>
                            <p><strong>Description:</strong> {event.description}</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};