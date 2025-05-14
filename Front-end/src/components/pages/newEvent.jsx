import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { allEventsApi, addEventApi } from "../api/eventApi";

export default function NewEvent() {
    const [event, setEvent] = useState("");
    const [place, setPlace] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setstartTime] = useState("");
    const [endTime, setendTime] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("event", event);
      formData.append("place", place);
      formData.append("date", date);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("description", description);
      formData.append("image", image);
      const response = await addEventApi(formData);
      if (response.status === 200) {
        const allEventResponse = await allEventsApi();
        const allEvents = allEventResponse.data.data;
        allEvents.forEach((event) => {
          console.log(event);
        });
        navigate("/events/allEvents", { state: { allEvents } });
      } else {
        alert(response.message);
      }
    }
  return (
    <div className="font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center mb-10 overflow-scroll bg-[#dcdcdc]">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-black text-center">Create a New Event</h2>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="event" className="block text-black mb-2"> Event Name </label>
              <input id="event" type="event" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Enter Event Name" value={event} onChange={(e)=>setEvent(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label htmlFor="place" className="block text-black mb-2"> Place </label>
              <input id="place" type="place" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Enter Place" value={place} onChange={(e)=>setPlace(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-black mb-2"> Date </label>
              <input id="date" type="date" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Enter Date" value={date} onChange={(e)=>setDate(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block text-black mb-2"> Event Start Time </label>
              <input id="time" type="time" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Enter Time" value={startTime} onChange={(e)=>setstartTime(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-black mb-2"> Event End Time </label>
              <input id="endTime" type="time" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Enter Time" value={endTime} onChange={(e)=>setendTime(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-black mb-2"> Description </label>
              <input id="description" type="description" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Enter Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-black mb-2"> Upload Image </label>
              <input id="image" type="file" className="w-full p-2 border border-gray-300 rounded" required
              accept="image/*" name="image" placeholder="Upload Image" onChange={(e) => setImage(e.target.files[0])} />
              <span class="text-sm text-gray-500">Max file size is 2MB</span>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"> Submit </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}