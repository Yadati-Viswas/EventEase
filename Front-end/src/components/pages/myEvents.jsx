import Navbar from '../Navbar';
import Footer from '../Footer';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { deleteEventApi } from '../api/eventApi';

export default function MyEvents(){
    const location = useLocation();
    const Navigate = useNavigate();
    const myEvents = location.state?.myEvents || [];
    const UpdateEvent = async (event, e) => {
        e.preventDefault();
        Navigate("/events/UpdateEvent", { state: { event } });
        
    }
    const DeleteEvent = async (event, e) => {
        e.preventDefault();
        const eventId = event._id;
        const response = await deleteEventApi(eventId);
        if (response.status === 200) {
            alert("Deleted successfully!");
            Navigate("/");
        } else {
            alert("Deletion failed!");
        }
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
                <div className='bg-white p-8 rounded shadow'>
                    <h2 className="text-2xl font-bold mb-6 text-black text-center">My Events</h2>
                    {myEvents.map((event) => (
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
                        <div className='flex mt-4 justify-center items-center'>
                        <button onClick={(e) => UpdateEvent(event, e)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                        Update</button>
                        <button onClick={(e) => DeleteEvent(event, e)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer ml-2">
                        Delete </button>
                        </div>
                    </div>
                    ))
                    }
                </div>
            </div>
            <Footer />
        </div> 
    )
}