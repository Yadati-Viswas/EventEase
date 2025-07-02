import { useNavigate } from "react-router-dom";
import { allEventsApi } from "./api/eventApi"; 

export default function Body() {
  const Navigate = useNavigate(); 
  const getAllEvents = async () => { 
    const allEventResponse = await allEventsApi();
    const allEvents = allEventResponse.data.data;
    console.log("All Events:", allEvents);
    console.log(allEvents);
    Navigate("/events/allEvents", { state: { allEvents} });
  };
    return (
      <main className="flex-grow flex-center pt-4 bg-[#dcdcdc] min-h-screen">
        <div className="container mx-auto p-4 bg-white rounded shadow-lg">
          <h1 className="text-3xl text-center font-bold mb-4">Event Ease</h1>
            <p className="mb-4 text-black">
                Event Ease is a event management system designed to connect event organizers with attendees. We provide an intuitive and powerful platform to plan, promote, and manage events of all sizes.
            </p>
            <p className="mb-4 text-black">
                Our mission is to simplify the event experience by offering tools that help manage every aspect—from registering to tracking the live updates.
            </p>
            <p className="mb-4 text-black">
                Whether you’re hosting a large conference, a local meetup, or a virtual seminar, EventEase is here to ensure your event is a success.
            </p>
            <p className="mb-4 text-black">
              Using our platform is simple and intuitive, with a focus on providing you with a seamless experience from start to finish. We've ensured that our design is clean and user-friendly, 
              making it easy for you to find and book your desired events.
              Get started today and discover the exciting events we have lined up for you!
            </p>
            <div className="bg-gray-300 p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Key Features:</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">✔</span>
                  <span>Browse and Register for upcoming events</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">✔</span>
                  <span>View essential details such as event title, Start Date, End Date and location</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">✔</span>
                  <span>Manage your bookings and easily cancel if needed</span>
                </li>
              </ul>
            </div>
          
          <div className="flex justify-center bg-gray-300 mt-6 hover:bg-gray-200 p-4 rounded shadow">
            <button onClick={getAllEvents} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
              View All Events and Register
            </button>
          </div>
        </div>
      </main>
    );
  }

  