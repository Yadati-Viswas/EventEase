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
        <div className="min-h-screen flex flex-col font-sans absolute inset-0 z-0">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]" style={{backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251, 191, 36, 0.25), transparent 100%)`, backgroundColor: "#dcdcdc"}}>
                <div className='bg-white p-8 rounded shadow' style={{background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)"}}>
                    <h2 className="text-2xl font-bold mb-6 text-black text-center">Registered Events</h2>
                    {registeredEvents.map((event) => (
                    <div key={event._id} className="p-4 mb-4 rounded shadow" >
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