import Footer from "../Footer";
import Navbar from "../Navbar";
import { useEffect,useState } from "react";
import { getRegisteredEventsApi } from "../api/eventApi";

export default function RegisteredEvents() {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    useEffect(() => {
        const getRegisteredEvents = async () => {
            const response = await getRegisteredEventsApi();
            console.log("Registered Events Response:", response.data.data);
            if (response.status === 200 || response.status === 304) {
              setRegisteredEvents(response.data.data);
            } else {
              alert(response.message);
            }
        };
        getRegisteredEvents();
    }, []);
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
                <div className='bg-white p-8 rounded shadow'>
                    <h2 className="text-2xl font-bold mb-6 text-black text-center">Registered Events</h2>
                    {registeredEvents.map((event) => (
                    <div key={event._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
                        <h2 className="text-xl font-bold">{event.event}</h2>
                        <div className="flex text-black">
                        <div>
                            <img src={event.image} alt={event.event} className="w-48 h-48 mt-2 rounded" />
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
                    </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};