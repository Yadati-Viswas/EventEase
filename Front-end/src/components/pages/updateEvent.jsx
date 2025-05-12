import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function UpdateEvent() {
    const location = useLocation();
    const eventData = location.state?.event || {};
    console.log("Event Data:", eventData);
    const [event, setEvent] = useState("");
    const [place, setPlace] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setstartTime] = useState("");
    const [endTime, setendTime] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    useEffect(() => {
        const typeCastDate = new Date(eventData.date).toISOString().split("T")[0];
        console.log("Type Casted Date:", typeCastDate);
        if (eventData) {
            setEvent(eventData.event);
            setPlace(eventData.place);
            setDate(typeCastDate);
            setstartTime(eventData.startTime);
            setendTime(eventData.endTime);
            setDescription(eventData.description);
            setImage(eventData.image);
        }
    }, [eventData]);
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
      const response = await axios(`http://localhost:3000/events/updateEvent/${eventData._id}`, {
        method: "POST",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const allEventResponse = await axios("http://localhost:3000/events/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const allEvents = allEventResponse.data.data;
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
          <h2 className="text-2xl font-bold mb-6 text-black text-center">Update Event</h2>
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
            <button type="submit" onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"> Submit </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}